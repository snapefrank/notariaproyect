const Artwork = require('../models/Artwork');
const path = require('path');
const fs = require('fs');

// Obtener todas las piezas de arte
exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una pieza de arte por ID
exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Obra no encontrada' });
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
      ownerExternalName // campo opcional
    } = req.body;

    const certificatePath = req.files?.certificate?.[0]
      ? `artworks/certificates/${req.files.certificate[0].filename}`
      : '';

    const photoPaths = req.files?.photos?.map(file => `artworks/photos/${file.filename}`) || [];

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
    const updates = { ...req.body };

    if (req.files?.certificate) {
      updates.certificatePath = `artworks/certificates/${req.files.certificate[0].filename}`;
    }

    if (req.files?.photos) {
      updates.photoPaths = req.files.photos.map(file => `artworks/photos/${file.filename}`);
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
