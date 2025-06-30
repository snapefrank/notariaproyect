const Artwork = require('../models/Artwork');

// Obtener todas las piezas de arte
exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva pieza de arte
exports.createArtwork = async (req, res) => {
  try {
    const artwork = new Artwork(req.body);
    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar una pieza de arte
exports.updateArtwork = async (req, res) => {
  try {
    const updatedArtwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedArtwork);
  } catch (err) {
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