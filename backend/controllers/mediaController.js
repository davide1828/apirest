const Media = require('../models/mediaModel');
const Genero = require('../models/generoModel');
const Director = require('../models/directorModel');
const Productora = require('../models/productoraModel');
const { request, response } = require('express');

// Función para generar serial único
/**
 * Helper interno: Genera un serial único progresivo para las películas (PEL-0001, PEL-0002).
 * @returns {Promise<string>} String con el formato secuencial automático.
 */
const generateSerialNumber = async () => {
    // Busca la película con el serial PEL-xxxx más alto
    const lastMedia = await Media.findOne({ serial: /^PEL-\d+$/ })
        .sort({ serial: -1 })
        .collation({ locale: "en_US", numericOrdering: true });

    let nextNumber = 1;
    if (lastMedia && lastMedia.serial) {
        const match = lastMedia.serial.match(/^PEL-(\d+)$/);
        if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1;
        }
    }
    
    let serial = `PEL-${String(nextNumber).padStart(4, '0')}`;
    
    // Verificación de seguridad por concurrencia
    let exists = await Media.findOne({ serial });
    while (exists) {
        nextNumber++;
        serial = `PEL-${String(nextNumber).padStart(4, '0')}`;
        exists = await Media.findOne({ serial });
    }
    
    return serial;
};

/**
 * Trae una lista consolidada con la totalidad de los recursos multimedia disponibles.
 * Emplea mongoose 'populate' sobre sus claves foráneas para obtener no solo los ObjectIDs, sino también variables informativas (ID -> nombre).
 * @param {Object} req - Objeto solicitud.
 * @param {Object} res - Objeto respuesta con el listado cargado.
 * @returns {Promise<void>} Retorna un HTTP 200 con el array expandido.
 */
const getMedias = async (req = request, res = response) => {
    try {
        const medias = await Media.find()
            .populate('genero', 'nombre')
            .populate('director', 'nombre')
            .populate('productora', 'nombre')
            .populate('tipo', 'nombre');
        res.status(200).json(medias);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener medias 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener las medias' });
    }
};

/**
 * Punto de entrada para subir una nueva película/serie (Media) a la plataforma.
 * Lógica compleja: verifica que sus asociaciones sean válidas, que no estén repetidas mediante su URL, y autogenera un serial.
 * @param {Object} req - Request contentivo del body con datos variados.
 * @param {Object} res - Res contentivo del nuevo elemento validado y guardado.
 * @returns {Promise<void>} La película creada de forma estructurada (201) o mensajes descriptivos de fallos estructurales (400) / servidor (500).
 */
const createMedia = async (req = request, res = response) => {
    try {
        const { titulo, sinopsis, urlPelicula, imagen, anioEstreno, genero, director, productora, tipo } = req.body;

        // Validaciones - el serial ahora NO es requerido
        if (!titulo || !urlPelicula || !anioEstreno || !genero || !director || !productora || !tipo) {
            return res.status(400).json({ message: 'Los campos requeridos son obligatorios' });
        }

        // Verificar que la URL no exista
        const mediaUrlDB = await Media.findOne({ urlPelicula });
        if (mediaUrlDB) {
            return res.status(400).json({ message: `La URL ${urlPelicula} ya existe` });
        }

        const activeGenero = await Genero.findById(genero);
        if (!activeGenero || !activeGenero.isActive) {
            return res.status(400).json({ message: 'El género seleccionado no existe o está inactivo' });
        }

        const activeDirector = await Director.findById(director);
        if (!activeDirector || !activeDirector.isActive) {
            return res.status(400).json({ message: 'El director seleccionado no existe o está inactivo' });
        }

        const activeProductora = await Productora.findById(productora);
        if (!activeProductora || !activeProductora.isActive) {
            return res.status(400).json({ message: 'La productora seleccionada no existe o está inactiva' });
        }

        // Generar serial automático
        const generatedSerial = await generateSerialNumber();

        const media = new Media({
            serial: generatedSerial,
            titulo,
            sinopsis,
            urlPelicula,
            imagen,
            anioEstreno,
            genero,
            director,
            productora,
            tipo
        });

        await media.save();
        await media.populate('genero', 'nombre');
        await media.populate('director', 'nombre');
        await media.populate('productora', 'nombre');
        await media.populate('tipo', 'nombre');

        res.status(201).json(media);
    } catch (error) {
        console.error('🚧🚧🚧Error al crear media 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al crear la media' });
    }
};

/**
 * Adquiere un único título consultándolo por su identificador base.
 * Rellena de forma extensa mediante dependencias (populate) para conformar su vista detallada.
 * @param {Object} req - Request conteniendo los \`params.id\` del recurso demandado.
 * @param {Object} res - Objeto respuesta.
 * @returns {Promise<void>} Vista con información expandida de la obra solicitada (200) o un 404 (ausente).
 */
const getMediaById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const media = await Media.findById(id)
            .populate('genero', 'nombre')
            .populate('director', 'nombre')
            .populate('productora', 'nombre')
            .populate('tipo', 'nombre');

        if (!media) {
            return res.status(404).json({ message: 'Media no encontrada' });
        }

        res.status(200).json(media);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener media 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener la media' });
    }
};

/**
 * Consolida un cambio masivo de estado o simple edición general para una obra audiovisual.
 * Chequea exhaustivamente la disponibilidad de cada componente relacional atado (género, productora) antes de admitir cualquier update a su modelo padre para no dejarlo cojo.
 * @param {Object} req - Request en la cual el body acarrea los repuestos y los params su ID global.
 * @param {Object} res - La representación completa del medio ya transformado con exito.
 * @returns {Promise<void>} Retorna la peli final exitosa (200) o fallos lógicos a nivel de relaciones (genero no existente, url copiada) u operacionales (500).
 */
const updateMedia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        // El serial NO se desestructura ni se actualiza para garantizar su inmutabilidad
        const { titulo, sinopsis, urlPelicula, imagen, anioEstreno, genero, director, productora, tipo } = req.body;

        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({ message: 'Media no encontrada' });
        }

        // Verificar URL única
        if (urlPelicula && urlPelicula !== media.urlPelicula) {
            const mediaUrlDB = await Media.findOne({ urlPelicula, _id: { $ne: id } });
            if (mediaUrlDB) {
                return res.status(400).json({ message: `La URL ${urlPelicula} ya existe` });
            }
            media.urlPelicula = urlPelicula;
        }

        if (titulo) media.titulo = titulo;
        if (sinopsis) media.sinopsis = sinopsis;
        if (imagen) media.imagen = imagen;
        if (anioEstreno) media.anioEstreno = anioEstreno;
        if (tipo) media.tipo = tipo;

        if (genero) {
            const activeGenero = await Genero.findById(genero);
            if (!activeGenero || !activeGenero.isActive) return res.status(400).json({ message: 'El género seleccionado no existe o está inactivo' });
            media.genero = genero;
        }

        if (director) {
            const activeDirector = await Director.findById(director);
            if (!activeDirector || !activeDirector.isActive) return res.status(400).json({ message: 'El director seleccionado no existe o está inactivo' });
            media.director = director;
        }

        if (productora) {
            const activeProductora = await Productora.findById(productora);
            if (!activeProductora || !activeProductora.isActive) return res.status(400).json({ message: 'La productora seleccionada no existe o está inactiva' });
            media.productora = productora;
        }

        media.fechaActualizacion = Date.now();
        await media.save();
        
        await media.populate('genero', 'nombre');
        await media.populate('director', 'nombre');
        await media.populate('productora', 'nombre');
        await media.populate('tipo', 'nombre');

        res.status(200).json(media);
    } catch (error) {
        console.error('🚧🚧🚧Error al actualizar media 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar la media' });
    }
};

/**
 * Supresión definitiva de este objeto cinematográfico puntual en las tablas.
 * @param {Object} req - Object conteniendo en ruta su llave maestra temporal `id`.
 * @param {Object} res - JSON informativo de salida certificando la finalización exitosa.
 * @returns {Promise<void>} Se remite (200) o bien rechazo absoluto con log en catch (500).
 */
const deleteMedia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const media = await Media.findByIdAndDelete(id);

        if (!media) {
            return res.status(404).json({ message: 'Media no encontrada' });
        }

        res.status(200).json({ message: 'Media eliminada correctamente', media });
    } catch (error) {
        console.error('🚧🚧🚧Error al eliminar media 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al eliminar la media' });
    }
};

module.exports = {
    getMedias,
    createMedia,
    getMediaById,
    updateMedia,
    deleteMedia
};
