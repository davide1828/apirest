const Tipo = require('../models/tipoModel');
const { request, response } = require('express');

/**
 * Obtiene la lista descriptiva con todos los tipos de media (ej. Película, Serie, Corto).
 * Función que permite nutrir selectores o menús del lado cliente.
 * @param {Object} req - Objeto Express de petición.
 * @param {Object} res - Objeto Express de respuesta.
 * @returns {Promise<void>} Salida JSON con los diferentes tipos registrados (200) o error de base de datos (500).
 */
const getTipos = async (req = request, res = response) => {
    try {
        const tipos = await Tipo.find();
        res.status(200).json(tipos);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener tipos 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener los tipos' });
    }
};

/**
 * Crea la definición de un nuevo tipo de medio en la plataforma.
 * Se asegura de que cada tipo reciba un nombre y evita los nombres repetidos en la plataforma.
 * @param {Object} req - Petición con un body que incluye `nombre` y `descripcion` del tipo.
 * @param {Object} res - Objeto Express de respuesta.
 * @returns {Promise<void>} Salida 201 en caso de la creación exitosa; 400 si falta el nombre o ya existe; 500 por error interno.
 */
const createTipo = async (req = request, res = response) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del tipo es obligatorio' });
        }

        const tipoDB = await Tipo.findOne({ nombre });
        if (tipoDB) {
            return res.status(400).json({ message: `El tipo ${nombre} ya existe` });
        }

        const tipo = new Tipo({ nombre, descripcion });
        await tipo.save();

        res.status(201).json(tipo);
    } catch (error) {
        console.error('🚧🚧🚧Error al crear tipo 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al crear el tipo' });
    }
};

/**
 * Permite la búsqueda detallada y recuperación de un único tipo utilizando su ID respectivo.
 * Útil para procesos de edición individualizada.
 * @param {Object} req - Objeto de petición expresando el parámetro `id`.
 * @param {Object} res - Objeto Express de respuesta.
 * @returns {Promise<void>} JSON con el objeto solicitado (200), mensaje de no encontrado (404) o fallo interno (500).
 */
const getTipoById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const tipo = await Tipo.findById(id);

        if (!tipo) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }

        res.status(200).json(tipo);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener tipo 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener el tipo' });
    }
};

/**
 * Gestiona el cambio en las propiedades de un tipo que ya figura en base de datos.
 * Verifica si el nombre nuevo colisiona con el nombre de otro tipo diferente para garantizar unicidad.
 * @param {Object} req - Petición que lleva en `params` el ID y en el `body` las propiedades (`nombre`, `descripcion`).
 * @param {Object} res - Respuesta a proveer. 
 * @returns {Promise<void>} Una respuesta al cliente reflejando un tipo funcionalmente actualizado (200) o avisando el error suscitado (404/400).
 */
const updateTipo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const tipo = await Tipo.findById(id);
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }

        if (nombre) {
            const tipoDB = await Tipo.findOne({ nombre, _id: { $ne: id } });
            if (tipoDB) {
                return res.status(400).json({ message: `El tipo ${nombre} ya existe` });
            }
            tipo.nombre = nombre;
        }

        if (descripcion) tipo.descripcion = descripcion;

        tipo.fechaActualizacion = Date.now();
        await tipo.save();

        res.status(200).json(tipo);
    } catch (error) {
        console.error('🚧🚧🚧Error al actualizar tipo 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar el tipo' });
    }
};

/**
 * Suprime de forma permanente un registro de tipo usando su ID numérico.
 * Ejecuta validación sobre si el objeto realmente existía antes de confirmar su borrado.
 * @param {Object} req - Objeto de petición especificando con `id`.
 * @param {Object} res - Objeto de respuesta que alojará el OK textual.
 * @returns {Promise<void>} El estado de éxito del servidor confirmando la destrucción física (200) o reporte de error (404/500).
 */
const deleteTipo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const tipo = await Tipo.findByIdAndDelete(id);

        if (!tipo) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }

        res.status(200).json({ message: 'Tipo eliminado correctamente', tipo });
    } catch (error) {
        console.error('🚧🚧🚧Error al eliminar tipo 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al eliminar el tipo' });
    }
};

module.exports = {
    getTipos,
    createTipo,
    getTipoById,
    updateTipo,
    deleteTipo
};
