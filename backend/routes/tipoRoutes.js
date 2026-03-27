const { Router } = require('express');
const { getTipos, createTipo, getTipoById, updateTipo, deleteTipo } = require('../controllers/tipoController');

const router = Router();



router.get('/', getTipos);
router.post('/', createTipo);
router.get('/:id', getTipoById);
router.put('/:id', updateTipo);
router.delete('/:id', deleteTipo);

module.exports = router;
