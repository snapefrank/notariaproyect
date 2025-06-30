const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: String,
  descripcion: String,
  miembros: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Association', associationSchema);