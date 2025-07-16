const express = require('express');
const router = express.Router();
const moralPersonController = require('../controllers/moralPerson.controller');
const uploadCombined = require('../middlewares/uploadCombined'); 

// Obtener todas las personas morales
router.get('/', moralPersonController.getAllMoralPersons);

// Obtener una persona moral por ID
router.get('/:id', moralPersonController.getMoralPersonById);

// Crear una nueva persona moral con todos los documentos
router.post('/', uploadCombined, moralPersonController.createMoralPerson);

// Actualizar una persona moral (con archivos opcionales)
router.put('/:id', uploadCombined, moralPersonController.updateMoralPerson);

// Eliminar una persona moral
router.delete('/:id', moralPersonController.deleteMoralPerson);

module.exports = router;
