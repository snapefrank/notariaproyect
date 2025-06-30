const express = require('express');
const router = express.Router();
const docCtrl = require('../controllers/document.controller');

router.get('/', docCtrl.getAllDocuments);
router.post('/', docCtrl.createDocument);
router.put('/:id', docCtrl.updateDocument);
router.delete('/:id', docCtrl.deleteDocument);

module.exports = router;

