const mongoose = require('mongoose');

const moralPersonSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rfc: { type: String, required: true, unique: true },
  regimenFiscal: { type: String },
  domicilioFiscal: { type: String },
  fechaConstitucion: { type: Date },

  credito: {
    institucionFinanciera: { type: String },
    montoCredito: { type: Number },
    plazoMeses: { type: Number },
    tasaInteresAnual: { type: Number },
    pagoMensual: { type: Number },
    tieneInmuebleGarantia: { type: Boolean },
    inmuebleGarantia: {
      tipoInmueble: { type: String },
      direccionInmueble: { type: String },
      valorComercial: { type: Number },
      documentos: {
        escritura: { type: String }, // archivo PDF
        adicional: { type: String }  // puede ser avalúo o certificado
      }
    },
    observaciones: { type: String }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoralPerson', moralPersonSchema);
