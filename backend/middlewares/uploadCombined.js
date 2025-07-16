const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `uploads/persons/combined`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ✅ Exportas directamente el middleware con `.fields(...)`
module.exports = upload.fields([
  { name: 'insuranceFile', maxCount: 10 },
  { name: 'rfcFile', maxCount: 1 },
  { name: 'curpFile', maxCount: 1 },
  { name: 'nssFile', maxCount: 1 },
  { name: 'escritura', maxCount: 1 },
  { name: 'adicional', maxCount: 1 },
  { name: 'additionalDocs', maxCount: 10 }
]);
