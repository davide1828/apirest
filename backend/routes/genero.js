const {Router} = require('express');
const { getGeneros, createGenero } = require('../controllers/generoController');

const router = Router();

router.get('/', getGeneros);
router.post('/', createGenero);

module.exports = router;