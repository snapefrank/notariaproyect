const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },           // Título de la obra
  artist: { type: String, required: true },          // Nombre del artista
  type: { type: String },                            // Tipo de obra (pintura, escultura, etc.)
  technique: { type: String },                       // Técnica usada
  year: { type: Number },                            // Año de la obra
  dimensions: { type: String },                      // Medidas (ej. "60x80 cm")

  certificatePath: { type: String },                 // Ruta del documento de certificado
  photoPaths: [{ type: String }],                    // Rutas de imágenes

  acquisitionDate: { type: Date },
  value: { type: Number },
  location: { type: String },
  description: { type: String },

  // 🔹 Relación con personas físicas o morales
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'ownerType',
    required: function () {
      return this.ownerType !== 'Personalizado' && !this.ownerExternalName;
    }
  },
  ownerType: {
    type: String,
    enum: ['PhysicalPerson', 'MoralPerson', 'Personalizado'],
    required: true
  },
  ownerExternalName: {
    type: String,
    required: function () {
      return this.ownerType === 'Personalizado';
    }
  }

}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);
