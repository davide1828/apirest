const Genero = require('../models/generoModel');
const { request, response } = require('express');

/**
 * Obtiene todos los géneros registrados en la base de datos.
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Retorna una lista JSON con los géneros o un mensaje de error 500 en caso de fallo.
 */
const getGeneros = async (req = request, res = response) => {
    try {
        const generos = await Genero.find();
        res.status(200).json(generos);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener géneros 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrio un error al obtener los géneros' });
    }

}
/**
 * Crea un nuevo género en la base de datos.
 * Valida de forma previa que el nombre del género no exista ya para evitar duplicados.
 * @param {Object} req - Objeto de petición que contiene `nombre` y `descripcion` en el body.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Retorna el registro creado (201) o un error si ya existe (400) / fallo de servidor (500).
 */
const createGenero = async (req = request, res = response) => {
    try {
        const { nombre, descripcion } = req.body;

        const generoDB = await Genero.findOne({ nombre});
        if (generoDB) {
            return res.status(400).json({ message: `El género ${nombre} ya existe` });
        }

        const genero = new Genero({ nombre, descripcion });

        await genero.save();

        res.status(201).json(genero);

    } catch (error) {
        console.error('🚧🚧🚧Error al crear género 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrio un error al crear el género' });
    }
}

/**
 * Actualiza la información de un género existente mediante su ID.
 * Verifica previamente si el género existe y también asegura que no colisione con el nombre de otro género.
 * @param {Object} req - Objeto de petición conteniendo el ID en parámetros y datos a cambiar en el body.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Retorna el género editado (200), no encontrado (404), error por duplicidad (400) o fallo (500).
 */
const updateGenero = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const genero = await Genero.findById(id);
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }

        // Verificar que el nombre no exista en otro género
        if (nombre && nombre !== genero.nombre) {
            const generoDB = await Genero.findOne({ nombre, _id: { $ne: id } });
            if (generoDB) {
                return res.status(400).json({ message: `El género ${nombre} ya existe` });
            }
            genero.nombre = nombre;
        }

        if (descripcion !== undefined) {
            genero.descripcion = descripcion;
        }

        await genero.save();
        res.status(200).json(genero);

    } catch (error) {
        console.error('🚧🚧🚧Error al actualizar género 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrio un error al actualizar el género' });
    }
}

/**
 * Elimina un género específico de la base de datos basándose en su ID.
 * Verifica su existencia antes de intentar borrarlo.
 * @param {Object} req - Objeto de petición conteniendo el ID en parámetros.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} - Mensaje de éxito (200), no encontrado (404) o error de servidor (500).
 */
const deleteGenero = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const genero = await Genero.findById(id);
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }

        await Genero.findByIdAndDelete(id);
        res.status(200).json({ message: 'Género eliminado correctamente' });

    } catch (error) {
        console.error('🚧🚧🚧Error al eliminar género 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrio un error al eliminar el género' });
    }
}

module.exports = {
    getGeneros,
    createGenero,
    updateGenero,
    deleteGenero
};