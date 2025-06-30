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
  owner: { type: String, required: true },               // Propietario
  usufruct: { type: String },                            // Usufructo
  deedNumber: { type: String, required: true },          // Número de escritura
  deedDate: { type: Date, required: true },              // Fecha de escritura
  deedFileUrl: { type: String },                         // Archivo de escritura
  notary: { type: String, required: true },              // Notaría
  cadastralKey: { type: String, required: true },        // Clave catastral
  location: { type: String, required: true },            // Ubicación
  totalArea: { type: Number, required: true },           // Superficie total

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

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
