const Director = require('../models/Director');
const { request, response } = require('express');

const getDirectores = async (req = request, res = response) => {
    try {
        const directores = await Director.find();
        res.status(200).json(directores);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener directores 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener los directores' });
    }
};

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

const updateDirector = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, estado } = req.body;

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

        if (estado) {
            director.estado = estado;
        }

        director.fechaActualizacion = Date.now();
        await director.save();

        res.status(200).json(director);
    } catch (error) {
        console.error('🚧🚧🚧Error al actualizar director 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar el director' });
    }
};

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
