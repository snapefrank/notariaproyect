const mongoose = require('mongoose');

// Esquema para cada local dentro del inmueble
const localSchema = new mongoose.Schema({
  name: { type: String, required: true },                // Nombre del local
  tenant: { type: String },                              // Arrendatario
  rentStartDate: { type: Date },                         // Inicio de renta
  rentEndDate: { type: Date },                           // Fin de renta
  rentedArea: { type: Number },                          // Superficie rentada
  rentCost: { type: Number },                            // Costo mensual
  rentContractUrl: { type: String },                     // Contrato de arrendamiento (archivo)
  photos: [{ type: String }],                            // Fotos del local
}, { _id: false });

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },                // Nombre de la propiedad
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tipoPropietario',
    required: function () {
      return this.tipoPropietario !== 'Personalizado';
    }
  },
  tipoPropietario: {
    type: String,
    enum: ['PhysicalPerson', 'MoralPerson', 'Personalizado'],
    required: true
  },
  owner: { type: String }, // Puedes dejarlo para mostrar el nombre directamente si quieres
  valor_total: { type: Number },                         // Valor total del inmueble
  usufruct: { type: String },                            // Usufructo
  deedNumber: { type: String, required: true },          // Número de escritura
  deedDate: { type: Date, required: true },              // Fecha de escritura
  deedFileUrl: { type: String },                         // Archivo de escritura
  notary: { type: String, required: true },              // Notaría
  cadastralKey: { type: String, required: true },        // Clave catastral
  location: { type: String, required: true },            // Ubicación en google maps


  totalArea: { type: Number, required: true },           // Superficie total

  type: { type: String, enum: ['residential', 'commercial', 'industrial', 'land'], required: true },

  // Gravamen
  hasEncumbrance: { type: Boolean, default: false },
  encumbranceInstitution: { type: String },
  encumbranceAmount: { type: Number },
  encumbranceDate: { type: Date },

  // Datos de renta general (si aplica al inmueble completo)
  isRented: { type: Boolean, default: false },
  tenant: { type: String },
  rentedArea: { type: Number },
  rentCost: { type: Number },
  rentStartDate: { type: Date },
  rentEndDate: { type: Date },
  rentContractUrl: { type: String },

  // Archivos generales del inmueble
  photos: [{ type: String }],
  extraDocs: [{ type: String }],

  // Locales incluidos dentro del inmueble
  locals: [localSchema],

  // Estado del inmueble
  status: { type: String, enum: ['active', 'sold'], default: 'active' },
  soldDate: { type: Date },
  soldNote: { type: String },
  saleDocuments: [String],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.connection.models['Property'];


module.exports = mongoose.model('Property', propertySchema);

