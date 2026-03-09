const { Router } = require('express');
const { getProductoras, createProductora, getProductoraById, updateProductora, deleteProductora } = require('../controllers/productoraController');

const router = Router();

router.get('/', getProductoras);
router.post('/', createProductora);
router.get('/:id', getProductoraById);
router.put('/:id', updateProductora);
router.delete('/:id', deleteProductora);

module.exports = router;
