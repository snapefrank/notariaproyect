const express = require('express');
const router = express.Router();
const associationController = require('../controllers/association.controller');

router.get('/', associationController.getAllAssociations);
router.post('/', associationController.createAssociation);
router.put('/:id', associationController.updateAssociation);
router.delete('/:id', associationController.deleteAssociation);

module.exports = router;