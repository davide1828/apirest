const { Schema, model } = require('mongoose');

const DirectorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del director es obligatorio'],
        unique: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
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
