const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const { request, response } = require('express');

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

const createMedia = async (req = request, res = response) => {
    try {
        const { serial, titulo, sinopsis, urlPelicula, imagen, anioEstreno, genero, director, productora, tipo } = req.body;

        // Validaciones
        if (!serial || !titulo || !urlPelicula || !anioEstreno || !genero || !director || !productora || !tipo) {
            return res.status(400).json({ message: 'Los campos requeridos son obligatorios' });
        }

        // Verificar que el serial no exista
        const mediaSerialDB = await Media.findOne({ serial });
        if (mediaSerialDB) {
            return res.status(400).json({ message: `El serial ${serial} ya existe` });
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

        const media = new Media({
            serial,
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

const updateMedia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { serial, titulo, sinopsis, urlPelicula, imagen, anioEstreno, genero, director, productora, tipo } = req.body;

        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({ message: 'Media no encontrada' });
        }

        // Verificar serial único
        if (serial && serial !== media.serial) {
            const mediaSerialDB = await Media.findOne({ serial, _id: { $ne: id } });
            if (mediaSerialDB) {
                return res.status(400).json({ message: `El serial ${serial} ya existe` });
            }
            media.serial = serial;
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
