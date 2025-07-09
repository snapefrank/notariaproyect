const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/persons/physical/docs';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueName}${path.extname(file.originalname)}`);
  }
});

const uploadPersonalDocs = multer({ storage });

module.exports = uploadPersonalDocs;
