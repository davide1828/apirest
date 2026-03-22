const Genero = require('../models/Genero');
const { request, response } = require('express');

const getGeneros = async (req = request, res = response) => {
    try {
        const generos = await Genero.find();
        res.status(200).json(generos);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener géneros 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrio un error al obtener los géneros' });
    }

}
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