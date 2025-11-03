const mongoose = require('mongoose');

const localEncumbranceSchema = new mongoose.Schema({
  institution: { type: String, required: true }, // Institución del gravamen
  amount: { type: Number, required: true },      // Monto
  date: { type: Date, required: true }           // Fecha
}, { _id: false });

// Esquema para cada local dentro del inmueble
const localSchema = new mongoose.Schema({
  name: { type: String },                                // Nombre del local
  tenant: { type: String },                              // Arrendatario
  rentStartDate: { type: Date },                         // Inicio de renta
  rentEndDate: { type: Date },                           // Fin de renta
  rentedArea: { type: Number },                          // Superficie rentada
  rentCost: { type: Number },                            // Costo mensual
  rentContractUrl: { type: String },                     // Contrato de arrendamiento (archivo)
  photos: [{ type: String }],                            // Fotos del local
  // Clave Catrastal
  cadastralKey: { type: String },                        // Clave catastral del local
  extraDocs: {                                           // Documentos adicionales del local
    archivos: [{ type: String }],                        // Rutas/URLs de archivos subidos
    nombresPersonalizados: [{ type: String }]            // Nombres asignados por el usuario (mismo índice que 'archivos')
  },
  //Gravamen
  hasEncumbrance: { type: Boolean, default: false },     // Si tiene gravamen
  encumbrances: [localEncumbranceSchema]                 // Lista de gravámenes asociados al local
}, { _id: false });

const propertySchema = new mongoose.Schema({
  name: { type: String },                // Nombre de la propiedad
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
  deedNumber: { type: String },          // Número de escritura
  deedDate: { type: Date },              // Fecha de escritura
  deed: {
    archivos: [String], nombrePersonalizado: String
  },      // Archivo de escritura
  notary: { type: String },              // Notaría
  cadastralKey: { type: String },        // Clave catastral
  location: { type: String },            // Ubicación en google maps

  totalArea: { type: Number },           // Superficie total

  type: { type: String, enum: ['residential', 'commercial', 'industrial', 'land'] },

  // Gravamen
  encumbrances: [{
    institution: { type: String, required: true },  // Institución que otorga el gravamen
    amount: { type: Number, required: true },       // Monto del gravamen
    date: { type: Date, required: true }            // Fecha del gravamen
  }],

  // Datos de renta general (si aplica al inmueble completo)
  isRented: { type: Boolean, default: false },
  tenant: { type: String },
  rentedArea: { type: Number },
  rentCost: { type: Number },
  rentStartDate: { type: Date },
  rentEndDate: { type: Date },
  rentContractUrl: { type: String },
  rentContractCustomName: { type: String, default: '' },


  // Archivos generales del inmueble
  photos: [{ type: String }],
  extraDocs: {
    archivos: [{ type: String }],
    nombresPersonalizados: [{ type: String }]
  },



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
