const Productora = require('../models/Productora');
const { request, response } = require('express');

const getProductoras = async (req = request, res = response) => {
    try {
        const productoras = await Productora.find();
        res.status(200).json(productoras);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener productoras 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener las productoras' });
    }
};

const createProductora = async (req = request, res = response) => {
    try {
        const { nombre, slogan, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre de la productora es obligatorio' });
        }

        const productoraDB = await Productora.findOne({ nombre });
        if (productoraDB) {
            return res.status(400).json({ message: `La productora ${nombre} ya existe` });
        }

        const productora = new Productora({ nombre, slogan, descripcion });
        await productora.save();

        res.status(201).json(productora);
    } catch (error) {
        console.error('🚧🚧🚧Error al crear productora 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al crear la productora' });
    }
};

const getProductoraById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const productora = await Productora.findById(id);

        if (!productora) {
            return res.status(404).json({ message: 'Productora no encontrada' });
        }

        res.status(200).json(productora);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener productora 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener la productora' });
    }
};

const updateProductora = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, estado, slogan, descripcion } = req.body;

        const productora = await Productora.findById(id);
        if (!productora) {
            return res.status(404).json({ message: 'Productora no encontrada' });
        }

        if (nombre) {
            const productoraDB = await Productora.findOne({ nombre, _id: { $ne: id } });
            if (productoraDB) {
                return res.status(400).json({ message: `La productora ${nombre} ya existe` });
            }
            productora.nombre = nombre;
        }

        if (estado) productora.estado = estado;
        if (slogan) productora.slogan = slogan;
        if (descripcion) productora.descripcion = descripcion;

        productora.fechaActualizacion = Date.now();
        await productora.save();

        res.status(200).json(productora);
    } catch (error) {
        console.error('🚧🚧🚧Error al actualizar productora 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar la productora' });
    }
};

const deleteProductora = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const productora = await Productora.findByIdAndDelete(id);

        if (!productora) {
            return res.status(404).json({ message: 'Productora no encontrada' });
        }

        res.status(200).json({ message: 'Productora eliminada correctamente', productora });
    } catch (error) {
        console.error('🚧🚧🚧Error al eliminar productora 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al eliminar la productora' });
    }
};

module.exports = {
    getProductoras,
    createProductora,
    getProductoraById,
    updateProductora,
    deleteProductora
};
