const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rutas exigiendo un JSON Web Token (JWT).
 * @param {Object} req - Objeto de Petición.
 * @param {Object} res - Objeto de Respuesta.
 * @param {Function} next - Continúa con la ejecución si el token es genuino.
 */
const validarJWT = (req, res, next) => {
    // Lectura vía Headers 'Authorization: Bearer <token>' o x-token
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : req.header('x-token');

    if (!token) {
        return res.status(401).json({
            message: 'No hay token proporcionado en la petición para autenticación.'
        });
    }

    try {
        const { uid, email } = jwt.verify(token, process.env.JWT_SECRET || 'secret_de_desarrollo_temporal');
        req.user = { uid, email };
        
        next();
    } catch (error) {
        console.error('Fallo en firma de token:', error.message);
        return res.status(401).json({
            message: 'El token proporcionado ha expirado o no es válido.'
        });
    }
};

module.exports = {
    validarJWT
};
