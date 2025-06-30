const mongoose = require('mongoose');

const moralPersonSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    rfc: { type: String, required: true, unique: true },
    regimenFiscal: { type: String },
    domicilioFiscal: { type: String },
    fechaConstitucion: { type: Date },
  },
  {
    timestamps: true, // ✅ Crea automáticamente createdAt y updatedAt
  }
);

module.exports = mongoose.model('MoralPerson', moralPersonSchema);
