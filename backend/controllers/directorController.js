const Director = require('../models/directorModel');
const { request, response } = require('express');

/**
 * Recupera de la base de datos todos los directores registrados.
 * Permite listarlos para su visualización general.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>} Arrays de directores (200) o código de error interno (500).
 */
const getDirectores = async (req = request, res = response) => {
    try {
        const directores = await Director.find();
        res.status(200).json(directores);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener directores 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener los directores' });
    }
};

/**
 * Crea un nuevo registro de director.
 * Hace validación principal de campos requeridos (nombre) e impide directores duplicados.
 * @param {Object} req - Petición con el body (donde se provee "nombre").
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>} Director recién creado (201) o mensajes de error por validación (400) / servidor (500).
 */
const createDirector = async (req = request, res = response) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del director es obligatorio' });
        }

        const directorDB = await Director.findOne({ nombre });
        if (directorDB) {
            return res.status(400).json({ message: `El director ${nombre} ya existe` });
        }

        const director = new Director({ nombre });
        await director.save();

        res.status(201).json(director);
    } catch (error) {
        console.error('🚧🚧🚧Error al crear director 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al crear el director' });
    }
};

/**
 * Recupera la información de un director específico basado en su ID.
 * Útil para visualizar detalles de un solo director.
 * @param {Object} req - Petición que incluye el ID en sus parámetros de ruta (`id`).
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>} El director hallado (200), no hallado (404), o error global (500).
 */
const getDirectorById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);

        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }

        res.status(200).json(director);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener director 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener el director' });
    }
};

/**
 * Actualiza la información de un director por su ID.
 * Controla que el nuevo nombre ingresado no esté siendo utilizado por otro registro.
 * Permite cambiar su estado (activo/inactivo).
 * @param {Object} req - Petición con el ID (params) y datos opcionales a actualizar (`nombre`, `isActive`) (body).
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>} Director editado (200), 404 si no existe, 400 por nombre duplicado, o 500 por fallo de servidor.
 */
const updateDirector = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, isActive } = req.body;

        const director = await Director.findById(id);
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }

        if (nombre) {
            const directorDB = await Director.findOne({ nombre, _id: { $ne: id } });
            if (directorDB) {
                return res.status(400).json({ message: `El director ${nombre} ya existe` });
            }
            director.nombre = nombre;
        }

        if (isActive !== undefined) {
            director.isActive = isActive;
        }

        director.fechaActualizacion = Date.now();
        await director.save();

        res.status(200).json(director);
    } catch (error) {
        console.error('🚧🚧🚧Error al actualizar director 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar el director' });
    }
};

/**
 * Elimina totalmente un director de la base de datos mediante su ID.
 * Es una eliminación física (hard delete).
 * @param {Object} req - Petición con el parámetro `id`.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>} Mensaje de proceso exitoso (200) o de error (404 / 500).
 */
const deleteDirector = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndDelete(id);

        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }

        res.status(200).json({ message: 'Director eliminado correctamente', director });
    } catch (error) {
        console.error('🚧🚧🚧Error al eliminar director 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al eliminar el director' });
    }
};

module.exports = {
    getDirectores,
    createDirector,
    getDirectorById,
    updateDirector,
    deleteDirector
};
