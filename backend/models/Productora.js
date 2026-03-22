const { Schema, model } = require('mongoose');

const ProductoraSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la productora es obligatorio'],
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: [true, 'El estado activo de la productora es obligatorio']
    },
    slogan: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = model('Productora', ProductoraSchema);
