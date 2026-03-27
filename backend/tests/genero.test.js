const request = require('supertest');
const express = require('express');
const generoRoutes = require('../routes/generoRoutes');

const app = express();
app.use(express.json());
app.use('/api/genero', generoRoutes);

// Mock middlewares or model functions to isolate testing (Unit Test)
jest.mock('../middlewares/auth', () => ({
    validarJWT: (req, res, next) => next() // Bypass JWT for testing routes directly
}));

jest.mock('../models/generoModel', () => {
    return {
        find: jest.fn().mockResolvedValue([{ _id: '123', nombre: 'Accion' }]),
        findOne: jest.fn().mockResolvedValue(null),
        prototype: {
            save: jest.fn().mockResolvedValue(true)
        }
    };
});

describe('Pruebas sobre la API de Géneros', () => {
    it('GET /api/genero - Debe retornar estado 200 y una lista', async () => {
        const res = await request(app).get('/api/genero');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].nombre).toBe('Accion');
    });

    it('POST /api/genero - Debe fallar con estado 400 si falta el nombre (Validation Middleware)', async () => {
        const res = await request(app)
            .post('/api/genero')
            .send({}); // Payload vacío dispara el middleware de express-validator

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors.nombre.msg).toBe('El nombre es obligatorio (express-validator)');
    });
});
