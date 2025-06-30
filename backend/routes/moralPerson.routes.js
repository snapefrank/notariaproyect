const express = require('express');
const router = express.Router();
const moralPersonController = require('../controllers/moralPerson.controller');

router.get('/', moralPersonController.getAllMoralPersons);
router.get('/:id', moralPersonController.getMoralPersonById); // ✅ Añadido
router.post('/', moralPersonController.createMoralPerson);
router.put('/:id', moralPersonController.updateMoralPerson);
router.delete('/:id', moralPersonController.deleteMoralPerson);

module.exports = router;
