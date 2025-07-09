const express = require('express');
const router = express.Router();
const docCtrl = require('../controllers/document.controller');
const upload = require('../middlewares/uploadDocuments');

router.get('/', docCtrl.getAllDocuments);
router.post('/', docCtrl.createDocument);
router.put('/:id', docCtrl.updateDocument);
router.delete('/:id', docCtrl.deleteDocument);

// ✅ Aquí solo pones `upload`, ya que es el middleware final
router.post('/upload', upload, docCtrl.uploadDocumentWithFile);

module.exports = router;
