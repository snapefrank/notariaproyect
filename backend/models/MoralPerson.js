  const mongoose = require('mongoose');

  const moralPersonSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    rfc: { type: String, required: true, unique: true },
    regimenFiscal: { type: String },
    domicilioFiscal: { type: String },
    fechaConstitucion: { type: Date },
    rfcFile: { type: String },
    additionalDocs: [{ type: String }],

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
