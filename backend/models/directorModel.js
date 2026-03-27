const { Schema, model } = require('mongoose');

const DirectorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del director es obligatorio'],
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: [true, 'El estado activo del director es obligatorio']
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

module.exports = model('Director', DirectorSchema);
