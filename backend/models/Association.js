const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  nombre: { type: String}, // Nombre de la asociación
  apoderadoLegal: { type: String },         // Apoderado legal
  numeroEscritura: { type: String },        // Número de escritura
  fechaEscritura: { type: Date },           // Fecha de escritura
  regimenFiscal: { type: String },          // Régimen fiscal
  rfc: { type: String },                    // RFC (texto)

  // Archivos
  deedFile: { type: String, default: '' },         // Escritura (PDF)
  rfcFile: { type: String, default: '' },          // RFC (PDF)
  additionalFiles: [
  {
    nombre: { type: String },
    url: { type: String }
  }
],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Association', associationSchema);
