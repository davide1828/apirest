const {Router} = require('express');
const { getGeneros, createGenero, updateGenero, deleteGenero } = require('../controllers/generoController');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validateFields');
const { validarJWT } = require('../middlewares/auth');

const router = Router();

router.get('/', getGeneros);

router.post('/', [
    validarJWT, // JWT requerido para crear
    check('nombre', 'El nombre es obligatorio (express-validator)').not().isEmpty(),
    validarCampos
], createGenero);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre no puede estar vacío si se envía').optional().not().isEmpty(),
    validarCampos
], updateGenero);

router.delete('/:id', validarJWT, deleteGenero);

module.exports = router;