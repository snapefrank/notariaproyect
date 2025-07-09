const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artwork.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'certificate') {
      cb(null, 'uploads/artworks/certificates/');
    } else if (file.fieldname === 'photos') {
      cb(null, 'uploads/artworks/photos/');
    } else {
      cb(null, 'uploads/'); // fallback
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Crear carpetas si no existen
const folders = [
  'uploads/artworks/certificates',
  'uploads/artworks/photos'
];
folders.forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// Rutas
router.get('/', artworkController.getAllArtworks);
router.get('/:id', artworkController.getArtworkById);

// Crear nueva obra con archivos
router.post(
  '/',
  upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
  ]),
  artworkController.createArtwork
);

// Actualizar obra con archivos
router.put(
  '/:id',
  upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
  ]),
  artworkController.updateArtwork
);

router.delete('/:id', artworkController.deleteArtwork);

module.exports = router;
