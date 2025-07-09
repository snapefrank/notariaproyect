const express = require('express');
const router = express.Router();
const physicalPersonController = require('../controllers/physicalPerson.controller');
const upload = require('../middlewares/uploadCombined'); // ✅ middleware correcto

// Obtener todas las personas físicas
router.get('/', physicalPersonController.getAllPhysicalPersons);

// Obtener una persona física por ID
router.get('/:id', physicalPersonController.getPhysicalPersonById);

// ✅ Crear una nueva persona física con todos los documentos
router.post(
  '/',
  upload.fields([
    { name: 'escritura', maxCount: 1 },
    { name: 'adicional', maxCount: 1 },
    { name: 'rfcFile', maxCount: 1 },
    { name: 'curpFile', maxCount: 1 },
    { name: 'nssFile', maxCount: 1 }
  ]),
  physicalPersonController.createPhysicalPerson
);
// ✅ Actualizar una persona física (con archivos opcionales)
router.put(
  '/:id',
  upload.fields([
    { name: 'escritura', maxCount: 1 },
    { name: 'adicional', maxCount: 1 },
    { name: 'rfcFile', maxCount: 1 },
    { name: 'curpFile', maxCount: 1 },
    { name: 'nssFile', maxCount: 1 }
  ]),
  physicalPersonController.updatePhysicalPerson
);


// Eliminar una persona física
router.delete('/:id', physicalPersonController.deletePhysicalPerson);

module.exports = router;
