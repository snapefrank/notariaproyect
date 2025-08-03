const Artwork = require('../models/Artwork');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Obtener todas las piezas de arte
exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find().lean();

    for (const artwork of artworks) {
      if (artwork.ownerId && mongoose.Types.ObjectId.isValid(artwork.ownerId)) {
        const model = artwork.ownerType === 'PhysicalPerson' ? 'PhysicalPerson'
          : artwork.ownerType === 'MoralPerson' ? 'MoralPerson'
            : null;

        if (model) {
          const owner = await mongoose.model(model).findById(artwork.ownerId).lean();
          artwork.ownerData = owner || null;
        }
      }
    }
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una pieza de arte por ID
exports.getArtworkById = async (req, res) => {
  try {
    let artwork = await Artwork.findById(req.params.id).lean();


    if (!artwork) return res.status(404).json({ message: 'Obra no encontrada' });
    if (artwork.ownerId && mongoose.Types.ObjectId.isValid(artwork.ownerId)) {
      const model = artwork.ownerType === 'PhysicalPerson' ? 'PhysicalPerson'
        : artwork.ownerType === 'MoralPerson' ? 'MoralPerson'
          : null;
      if (model) {
        const owner = await mongoose.model(model).findById(artwork.ownerId).lean();
        artwork.ownerData = owner || null;
      }
    }
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva pieza de arte
exports.createArtwork = async (req, res) => {
  try {
    const {
      artist,
      type,
      title,
      technique,
      year,
      dimensions,
      description,
      acquisitionDate,
      value,
      location,
      ownerId,
      ownerType,
      ownerExternalName
    } = req.body;

    const certificatePath = req.files?.certificate?.[0]
      ? `uploads/artworks/certificates/${req.files.certificate[0].filename}`
      : '';

    const photoPaths = req.files?.photos?.map(file => `uploads/artworks/photos/${file.filename}`) || [];

    // Validación de ID de propietario (opcional)
    if (ownerId && !mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ error: 'ID de propietario no válido' });
    }

    const newArtwork = new Artwork({
      artist,
      type,
      title,
      technique,
      year,
      dimensions,
      description,
      acquisitionDate,
      value,
      location,
      certificatePath,
      photoPaths,
      ownerId: ownerId || null,
      ownerType: ownerType || null,
      ownerExternalName: ownerExternalName || null
    });

    await newArtwork.save();
    res.status(201).json(newArtwork);
  } catch (err) {
    console.error('Error al crear obra:', err);
    res.status(400).json({ message: err.message });
  }
};

// Actualizar una pieza de arte
exports.updateArtwork = async (req, res) => {
  try {
    const existingArtwork = await Artwork.findById(req.params.id);
    if (!existingArtwork) return res.status(404).json({ message: 'Obra no encontrada' });

    const {
      artist,
      type,
      title,
      technique,
      year,
      dimensions,
      description,
      acquisitionDate,
      value,
      location,
      ownerId,
      ownerType,
      ownerExternalName
    } = req.body;

    const updates = {
      artist,
      type,
      title,
      technique,
      year,
      dimensions,
      description,
      acquisitionDate,
      value,
      location,
      ownerId: ownerId || existingArtwork.ownerId,
      ownerType: ownerType || existingArtwork.ownerType,
      ownerExternalName: (ownerType === 'Personalizado')
        ? (ownerExternalName || existingArtwork.ownerExternalName)
        : null,

    };

    // Validar ID de propietario (si se envía)
    if (ownerId && !mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ error: 'ID de propietario no válido' });
    }

    // Certificado nuevo
    if (req.files?.certificate) {
      updates.certificatePath = `uploads/artworks/certificates/${req.files.certificate[0].filename}`;
    }

    // Fotos nuevas: agregar a las existentes
    if (req.files?.photos) {
      const nuevasFotos = req.files.photos.map(file => `uploads/artworks/photos/${file.filename}`);
      updates.photoPaths = [...(existingArtwork.photoPaths || []), ...nuevasFotos];
    } else {
      updates.photoPaths = existingArtwork.photoPaths;
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedArtwork);
  } catch (err) {
    console.error('Error al actualizar obra:', err);
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una pieza de arte
exports.deleteArtwork = async (req, res) => {
  try {
    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pieza de arte eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteArtworkPhoto = async (req, res) => {
  try {
    const { id, photoIndex } = req.params;
    const artwork = await Artwork.findById(id);
    if (!artwork) return res.status(404).json({ message: 'Obra no encontrada' });

    const index = parseInt(photoIndex);
    if (isNaN(index) || index < 0 || index >= artwork.photoPaths.length) {
      return res.status(400).json({ message: 'Índice de foto inválido' });
    }

    const photoToDelete = artwork.photoPaths[index];

    // 1️⃣ Eliminar físicamente la foto del servidor
    if (photoToDelete && fs.existsSync(photoToDelete)) {
      fs.unlinkSync(photoToDelete);
    }

    // 2️⃣ Quitar del array
    artwork.photoPaths.splice(index, 1);

    await artwork.save();
    res.json({ message: 'Foto eliminada', artwork });
  } catch (err) {
    console.error('❌ Error al eliminar foto:', err);
    res.status(500).json({ message: 'Error al eliminar foto', error: err.message });
  }
};

// 🆕 Eliminar el certificado de una obra de arte
exports.deleteArtworkCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findById(id);
    if (!artwork) return res.status(404).json({ message: 'Obra no encontrada' });

    // 1️⃣ Eliminar físicamente el archivo del certificado si existe
    if (artwork.certificatePath && fs.existsSync(artwork.certificatePath)) {
      fs.unlinkSync(artwork.certificatePath);
    }

    // 2️⃣ Eliminar la referencia en la base de datos
    artwork.certificatePath = '';
    await artwork.save();

    res.json({ message: 'Certificado eliminado', artwork });
  } catch (err) {
    console.error('❌ Error al eliminar certificado:', err);
    res.status(500).json({ message: 'Error al eliminar certificado', error: err.message });
  }
};