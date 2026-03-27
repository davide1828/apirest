require( 'dotenv').config();
const express = require('express');
const cors = require('cors');

const { getConnection } = require('./db/db-connection-mongo');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS dinámica
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Permite todo en dev o una URL específica en prod
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());


/** --- Rutas --- */
app.use('/api/genero', require('./routes/generoRoutes'));
app.use('/api/director', require('./routes/directorRoutes'));
app.use('/api/productora', require('./routes/productoraRoutes'));
app.use('/api/tipo', require('./routes/tipoRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));

// Middlewares Finales: Manejo de Errores globales
const { globalErrorHandler } = require('./middlewares/errorHandler');
app.use(globalErrorHandler);

getConnection();

app.listen(PORT, () => {
    console.log(`🆗 Servidor corriendo en el puerto: ${PORT} ---`);
});