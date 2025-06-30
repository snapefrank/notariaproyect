const Association = require('../models/Association');

// Obtener todas las asociaciones
exports.getAllAssociations = async (req, res) => {
  try {
    const associations = await Association.find();
    res.json(associations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva asociación
exports.createAssociation = async (req, res) => {
  const association = new Association(req.body);
  try {
    const newAssociation = await association.save();
    res.status(201).json(newAssociation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar una asociación
exports.updateAssociation = async (req, res) => {
  try {
    const updatedAssociation = await Association.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAssociation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una asociación
exports.deleteAssociation = async (req, res) => {
  try {
    await Association.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asociación eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};