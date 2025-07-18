const multer = require('multer');
const path = require('path');

// Ruta destino: backend/uploads/properties/sale-docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/properties/sale-docs');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
