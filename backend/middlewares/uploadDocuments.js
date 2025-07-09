const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta destino
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtro: acepta PDF, imágenes JPEG y PNG
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Tipo de archivo no permitido'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload.single('file');  // Campo simple: file
