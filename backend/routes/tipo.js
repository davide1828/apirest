const { Router } = require('express');
const { getMedias, createMedia, getMediaById, updateMedia, deleteMedia } = require('../controllers/mediaController');

const router = Router();

router.get('/', getMedias);
router.post('/', createMedia);
router.get('/:id', getMediaById);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
