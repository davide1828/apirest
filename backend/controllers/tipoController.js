const Tipo = require('../models/Tipo');
const { request, response } = require('express');

const getTipos = async (req = request, res = response) => {
    try {
        const tipos = await Tipo.find();
        res.status(200).json(tipos);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener tipos 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener los tipos' });
    }
};

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
