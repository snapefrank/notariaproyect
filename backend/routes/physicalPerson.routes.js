const express = require('express');
const router = express.Router();
const physicalPersonController = require('../controllers/physicalPerson.controller');

// Obtener todas las personas físicas
router.get('/', physicalPersonController.getAllPhysicalPersons);

// 🔧 Obtener una persona física por ID (con documentos relacionados)
router.get('/:id', physicalPersonController.getPhysicalPersonById);

// Crear una nueva persona física
router.post('/', physicalPersonController.createPhysicalPerson);

// Actualizar una persona física
router.put('/:id', physicalPersonController.updatePhysicalPerson);

// Eliminar una persona física
router.delete('/:id', physicalPersonController.deletePhysicalPerson);

module.exports = router;
