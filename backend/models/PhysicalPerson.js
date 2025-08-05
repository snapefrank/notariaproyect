const mongoose = require('mongoose');

const physicalPersonSchema = new mongoose.Schema({
  nombres: { type: String},
  apellidoPaterno: { type: String},
  apellidoMaterno: { type: String},
  fechaNacimiento: { type: Date},
  rfc: { type: String},
  curp: { type: String},
  nss: { type: String},
  direccion: { type: String},
  sexo: { type: String, enum: ['M', 'F']},

  documentos: {
    rfc: { type: String },
    curp: { type: String },
    nss: { type: String }
  },
  documentosAdicionales: [
    {
      nombre: { type: String },
      url: { type: String }
    }
  ],
  datosMedicos: [{
    tipoSangre: { type: String },
    aseguradora: { type: String },
    tipoSeguro: { type: String },
    beneficiarios: { type: String },
    fechaInicioVigencia: { type: Date },
    fechaVencimiento: { type: Date },
    numeroPoliza: { type: String },
    prima: { type: String },
    archivoSeguro: [{ type: String }]
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
    archivoCredito: [{ type: String }], // ✅ Campo que faltaba
    inmuebleGarantia: {
      documentos: {
        escritura: { type: String },
        adicional: { type: String }
      }
    }
  }],


  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhysicalPerson', physicalPersonSchema);