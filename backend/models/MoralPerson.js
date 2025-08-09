const mongoose = require('mongoose');

const moralPersonSchema = new mongoose.Schema({
  nombre: { type: String },
  rfc: { type: String },
  regimenFiscal: { type: String },
  domicilioFiscal: { type: String },
  fechaConstitucion: { type: Date },
  rfcFile: { type: String },
  // Acepta strings antiguos y también objetos con nombre/url
  additionalDocs: [{
    nombre: { type: String },
    url: { type: String }
  }],


  creditos: [{
    institucionFinanciera: { type: String },
    montoCredito: { type: Number },
    plazoMeses: { type: Number },
    tasaInteresAnual: { type: Number },
    pagoMensual: { type: Number },
    tieneInmuebleGarantia: { type: Boolean },
    tipoInmueble: { type: String },
    direccionInmueble: { type: String },
    valorComercial: { type: Number },
    observaciones: { type: String },
    archivoCredito: [{ type: String }]
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoralPerson', moralPersonSchema);
