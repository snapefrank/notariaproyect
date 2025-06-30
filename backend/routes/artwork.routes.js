const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artwork.controller');

router.get('/', artworkController.getAllArtworks);
router.get('/:id', artworkController.getArtworkById); // ← Agregada esta línea
router.post('/', artworkController.createArtwork);
router.put('/:id', artworkController.updateArtwork);
router.delete('/:id', artworkController.deleteArtwork);

module.exports = router;
