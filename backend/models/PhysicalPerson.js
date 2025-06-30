const mongoose = require('mongoose');

const physicalPersonSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  rfc: { type: String, required: true },
  curp: { type: String, required: true },
  nss: { type: String, required: true },
  direccion: { type: String, required: true },
  sexo: { type: String, enum: ['M', 'F'], required: true },
  datosMedicos: {
    tipoSangre: { type: String },
    aseguradora: { type: String },
    tipoSeguro: { type: String },
    beneficiarios: { type: String },
    fechaInicioVigencia: { type: Date },
    fechaVencimiento: { type: Date },
    numeroPoliza: { type: String },
    prima: { type: String }, // Mensual/Anual
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhysicalPerson', physicalPersonSchema);