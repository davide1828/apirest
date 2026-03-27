/**
 * Middleware Global de Manejo de Errores.
 * Registra y unifica la salida de errores en toda la aplicación de manera limpia (DRY).
 * @param {Error} err - Instancia de Error arrojada o pasada vía next().
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Siguiente función.
 */
const globalErrorHandler = (err, req, res, next) => {
    console.error('🚧 [Error manejado globalmente]:', err.message || err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Error Interno del Servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = {
    globalErrorHandler
};
