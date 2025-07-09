const express = require('express');
const router = express.Router();
const moralPersonController = require('../controllers/moralPerson.controller');
const uploadCreditDocs = require('../middlewares/uploadCreditDocs'); // ✅ Middleware de carga de documentos

// Obtener todas las personas morales
router.get('/', moralPersonController.getAllMoralPersons);

// Obtener una persona moral por ID
router.get('/:id', moralPersonController.getMoralPersonById);

// Crear una nueva persona moral (con documentos de crédito)
router.post('/', uploadCreditDocs, moralPersonController.createMoralPerson);

// Actualizar una persona moral (con documentos de crédito)
router.put('/:id', uploadCreditDocs, moralPersonController.updateMoralPerson);

// Eliminar una persona moral
router.delete('/:id', moralPersonController.deleteMoralPerson);

module.exports = router;
