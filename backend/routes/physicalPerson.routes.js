const express = require('express');
const router = express.Router();
const physicalPersonController = require('../controllers/physicalPerson.controller');
const uploadCombined = require('../middlewares/uploadCombined'); // ✅ middleware ya configurado

// Obtener todas las personas físicas
router.get('/', physicalPersonController.getAllPhysicalPersons);

// Obtener una persona física por ID
router.get('/:id', physicalPersonController.getPhysicalPersonById);

// Crear una nueva persona física con todos los documentos
router.post('/', uploadCombined, physicalPersonController.createPhysicalPerson);

// Actualizar una persona física (con archivos opcionales)
router.put('/:id', uploadCombined, physicalPersonController.updatePhysicalPerson);

// Eliminar una persona física
router.delete('/:id', physicalPersonController.deletePhysicalPerson);

// ✅ Eliminar un documento específico de una persona física
router.delete('/:id/document/:docId', physicalPersonController.deletePhysicalPersonDocument);


module.exports = router;
