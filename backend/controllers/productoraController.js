const Productora = require('../models/productoraModel');
const { request, response } = require('express');

/**
 * Recupera el listado completo de productoras desde la base de datos.
 * @param {Object} req - Petición HTTP entrante.
 * @param {Object} res - Respuesta HTTP configurada para retornar arreglos.
 * @returns {Promise<void>} Arreglo de productoras (200) o fallo interno del servidor (500).
 */
const getProductoras = async (req = request, res = response) => {
    try {
        const productoras = await Productora.find();
        res.status(200).json(productoras);
    } catch (error) {
        console.error('🚧🚧🚧Error al obtener productoras 🚧🚧🚧', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener las productoras' });
    }
};

/**
 * Permite guardar y crear una nueva productora en el modelo de base de datos.
 * Chequea la obligatoriedad del nombre e impide los nombres repetidos en base a datos previos.
 * @param {Object} req - Petición que incluye el body con: nombre, slogan, descripcion.
 * @param {Object} res - Respuesta HTTP saliente.
 * @returns {Promise<void>} Un registro creado exitosamente (201), fallo por sintaxis/nombres duplicados (400) o error general (500).
 */
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

/**
 * Obtiene los detalles de una única productora a partir de su ID (Identificador de MongoDB).
 * @param {Object} req - La petición incluyendo `id` entre los parámetros de ruta ({req.params}).
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<void>} Objeto json de productora (200) o no encontrada (404).
 */
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

/**
 * Procesa la actualización de campos individuales en el perfil de una productora en particular por ID.
 * Valida de forma temprana si se está renombrando la productora hacia otro nombre ya existente (evitando excepciones SQL).
 * @param {Object} req - Petición que porta en los `params` el ID y en el `body` el objeto a actualizar.
 * @param {Object} res - La respuesta que servirá el proceso concluido.
 * @returns {Promise<void>} Retorna un objeto productora con información renovada (200) o sus errores en caso de fallo (404/400/500).
 */
const updateProductora = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, isActive, slogan, descripcion } = req.body;

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

        if (isActive !== undefined) productora.isActive = isActive;
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

/**
 * Ejecuta el borrado permanente de una productora individualmente, tomando como referencia su ID.
 * Valida previamente la existencia material del registro.
 * @param {Object} req - Petición dotada del ID numérico/hex de la productora en particular.
 * @param {Object} res - Objeto respuesta con un mensaje textual de la ejecución realizada.
 * @returns {Promise<void>} El string informando éxito (200) o notificación de su inexistencia / fallo (404 / 500).
 */
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
