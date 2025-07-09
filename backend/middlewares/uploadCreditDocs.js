// backend/middlewares/uploadCreditDocs.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir la ruta de guardado
const uploadDir = path.join(__dirname, '../uploads/persons/credits');

// Crear el directorio si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceptar solo PDF
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten archivos PDF'), false);
  }
  cb(null, true);
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter
});

// Exportamos el middleware con campos específicos
module.exports = upload.fields([
  { name: 'escritura', maxCount: 1 },
  { name: 'adicional', maxCount: 1 }
]);
