const {Router} = require('express');
const { getGeneros, createGenero, updateGenero, deleteGenero } = require('../controllers/generoController');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validateFields');

const router = Router();

router.get('/', getGeneros);

router.post('/', [
    check('nombre', 'El nombre es obligatorio (express-validator)').not().isEmpty(),
    validarCampos
], createGenero);

router.put('/:id', [
    check('nombre', 'El nombre no puede estar vacío si se envía').optional().not().isEmpty(),
    validarCampos
], updateGenero);

router.delete('/:id', deleteGenero);

module.exports = router;