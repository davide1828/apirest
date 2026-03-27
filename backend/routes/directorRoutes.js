const { Router } = require('express');
const { getDirectores, createDirector, getDirectorById, updateDirector, deleteDirector } = require('../controllers/directorController');

const router = Router();

router.get('/', getDirectores);
router.post('/', createDirector);
router.get('/:id', getDirectorById);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);

module.exports = router;
