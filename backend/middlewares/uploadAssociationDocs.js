const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para asegurar que el directorio existe
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (file.fieldname === 'deedFile') {
      uploadPath = path.resolve(__dirname, '../uploads/associations/deeds');
    } else if (file.fieldname === 'rfcFile') {
      uploadPath = path.resolve(__dirname, '../uploads/associations/rfc');
    } else if (file.fieldname === 'additionalFiles') {
      uploadPath = path.resolve(__dirname, '../uploads/associations/extra-docs');
    }

    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

module.exports = upload.fields([
  { name: 'deedFile', maxCount: 1 },
  { name: 'rfcFile', maxCount: 1 },
  { name: 'additionalFiles', maxCount: 10 }
]);
