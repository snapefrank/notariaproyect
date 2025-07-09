const mongoose = require('mongoose');
const Artwork = require('../models/Artwork'); // Ajusta la ruta si está en otra carpeta

const MONGO_URI = 'mongodb://localhost:27017/tu_base_de_datos'; // CAMBIA esto a tu URI real

const extractFilename = (fullPath) => {
  return fullPath.split('/').pop();
};

async function fixPaths() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const artworks = await Artwork.find();
  for (const artwork of artworks) {
    let updated = false;

    if (artwork.certificatePath && artwork.certificatePath.includes('/')) {
      artwork.certificatePath = extractFilename(artwork.certificatePath);
      updated = true;
    }

    if (Array.isArray(artwork.photoPaths)) {
      const cleaned = artwork.photoPaths.map(p => extractFilename(p));
      if (JSON.stringify(cleaned) !== JSON.stringify(artwork.photoPaths)) {
        artwork.photoPaths = cleaned;
        updated = true;
      }
    }

    if (updated) {
      await artwork.save();
      console.log(`✔ Obra corregida: ${artwork.title}`);
    }
  }

  await mongoose.disconnect();
  console.log('✅ Limpieza finalizada.');
}

fixPaths().catch(err => {
  console.error('Error durante la limpieza:', err);
  mongoose.disconnect();
});
