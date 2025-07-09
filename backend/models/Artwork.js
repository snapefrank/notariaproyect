const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },           // Título de la obra
  artist: { type: String, required: true },          // Nombre del artista
  type: { type: String, required: true },            // Tipo de obra (pintura, escultura, etc.)
  technique: { type: String, required: true },       // Técnica usada
  year: { type: Number },                            // Año de la obra
  dimensions: { type: String },                      // Medidas (ej. "60x80 cm")

  certificatePath: { type: String },                 // Ruta del documento de certificado
  photoPaths: [{ type: String }],                    // Rutas de imágenes

  acquisitionDate: { type: Date },
  value: { type: Number },
  location: { type: String },
  description: { type: String },

  // 🔹 Dueño registrado en el sistema
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tipoPropietario',
    required: false
  },
  tipoPropietario: {
    type: String,
    enum: ['PhysicalPerson', 'MoralPerson'],
    required: false
  },
  ownerExternalName: { type: String }




}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);
