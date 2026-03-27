const { validationResult } = require('express-validator');

/**
 * Middleware genérico para recolectar errores generados por express-validator.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Función para continuar a la siguiente capa.
 */
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
};

module.exports = {
    validarCampos
};
