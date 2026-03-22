const { Schema, model } = require('mongoose');

const GeneroSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del género es obligatorio'],
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: [true, 'El estado activo del género es obligatorio']
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

module.exports = model('Genero', GeneroSchema);