const express = require('express');
const router = express.Router();
const controller = require('../controllers/Property.controllers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer con rutas dinámicas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'deedFile') cb(null, 'uploads/properties/deeds/');
    else if (file.fieldname === 'propertyPhotos') cb(null, 'uploads/properties/photos/');
    else if (file.fieldname === 'extraDocs') cb(null, 'uploads/properties/extra-docs/');
    else if (file.fieldname === 'rentContractFile') cb(null, 'uploads/properties/rent-contracts/');
    else if (file.fieldname.startsWith('localPhotos_')) cb(null, 'uploads/locals/photos/');
    else if (file.fieldname.startsWith('localRentContract_')) cb(null, 'uploads/locals/contracts/');
    else cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Crear carpetas si no existen
const folders = [
  'uploads/properties/deeds',
  'uploads/properties/photos',
  'uploads/properties/extra-docs',
  'uploads/properties/rent-contracts',
  'uploads/locals/photos',
  'uploads/locals/contracts',
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// GET: Todas las propiedades
router.get('/', controller.getAllProperties);
// GET: Obtener propiedad por ID
router.get('/:id', controller.getPropertyById);


// POST: Crear nueva propiedad con todos los archivos (propiedad + locales)
router.post(
  '/',
  upload.fields([
    { name: 'deedFile', maxCount: 1 },
    { name: 'rentContractFile', maxCount: 1 },
    { name: 'propertyPhotos', maxCount: 20 },
    { name: 'extraDocs', maxCount: 20 },

    // Para locales (puedes poner más si quieres manejar hasta 10 locales, por ejemplo)
    { name: 'localRentContract_0', maxCount: 1 },
    { name: 'localPhotos_0', maxCount: 10 },
    { name: 'localRentContract_1', maxCount: 1 },
    { name: 'localPhotos_1', maxCount: 10 },
    { name: 'localRentContract_2', maxCount: 1 },
    { name: 'localPhotos_2', maxCount: 10 },
    { name: 'localRentContract_3', maxCount: 1 },
    { name: 'localPhotos_3', maxCount: 10 },
    // ... puedes continuar hasta local_9 o más si lo necesitas
  ]),
  controller.createProperty
);

// PUT: Actualizar propiedad
router.put(
  '/:id',
  upload.fields([
    { name: 'deedFile', maxCount: 1 },
    { name: 'rentContractFile', maxCount: 1 },
    { name: 'propertyPhotos', maxCount: 20 },
    { name: 'extraDocs', maxCount: 20 },
    { name: 'localRentContract_0', maxCount: 1 },
    { name: 'localPhotos_0', maxCount: 10 },
    { name: 'localRentContract_1', maxCount: 1 },
    { name: 'localPhotos_1', maxCount: 10 },
    { name: 'localRentContract_2', maxCount: 1 },
    { name: 'localPhotos_2', maxCount: 10 },
    { name: 'localRentContract_3', maxCount: 1 },
    { name: 'localPhotos_3', maxCount: 10 },
  ]),
  controller.updateProperty
);

// DELETE: Eliminar propiedad
router.delete('/:id', controller.deleteProperty);

// POST: Subir contrato individual
router.post('/:id/upload-rent-contract', upload.single('contract'), async (req, res) => {
  const propertyId = req.params.id;
  const filePath = req.file ? `/uploads/rent-contracts/${req.file.filename}` : null;

  if (!filePath) {
    return res.status(400).json({ message: 'No se subió ningún archivo.' });
  }

  try {
    const updated = await controller.updatePropertyContract(propertyId, filePath);
    res.json(updated);
  } catch (err) {
    console.error('❌ Error al guardar contrato:', err);
    res.status(500).json({ message: 'Error al guardar el contrato', error: err.message });
  }
});

// POST: Agregar un nuevo local a una propiedad existente
router.post(
  '/:propertyId/locals',
  upload.fields([
    { name: 'contract', maxCount: 1 },
    { name: 'localPhotos', maxCount: 10 },
  ]),
  controller.addLocalToProperty
);

// PUT: Actualizar local específico por índice
router.put(
  '/:propertyId/locals/:index',
  upload.fields([
    { name: 'contract', maxCount: 1 },
    { name: 'localPhotos', maxCount: 10 },
  ]),
  controller.updateLocalInProperty
);

// DELETE: Eliminar local por índice
router.delete('/:propertyId/locals/:index', controller.deleteLocalFromProperty);


module.exports = router;
