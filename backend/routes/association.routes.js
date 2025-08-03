const express = require('express');
const router = express.Router();
const associationController = require('../controllers/association.controller');
const uploadAssociationDocs = require('../middlewares/uploadAssociationDocs');

router.get('/', associationController.getAllAssociations);
router.post('/', uploadAssociationDocs, associationController.createAssociation);
router.put('/:id', uploadAssociationDocs, associationController.updateAssociation);
router.delete('/:id', associationController.deleteAssociation);
router.get('/:id', associationController.getAssociationById);
// 🗑 Eliminar archivos individuales
router.delete('/:id/rfc', associationController.deleteRfcFile);
router.delete('/:id/deed', associationController.deleteDeedFile);
router.delete('/:id/additional/:fileIndex', associationController.deleteAdditionalFile);



module.exports = router;
