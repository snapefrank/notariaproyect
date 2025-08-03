const MoralPerson = require('../models/MoralPerson');

// Obtener todas las personas morales
exports.getAllMoralPersons = async (req, res) => {
  try {
    const persons = await MoralPerson.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una persona moral por ID
exports.getMoralPersonById = async (req, res) => {
  try {
    const person = await MoralPerson.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Persona moral no encontrada' });
    }
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva persona moral
exports.createMoralPerson = async (req, res) => {
  try {
    const filesArray = req.files || [];
    const creditos = [];
    const parsedBody = parseNestedFormData(req.body);

    if (Array.isArray(parsedBody.creditos)) {
      parsedBody.creditos.forEach((credito, index) => {
        const archivoCredito = filesArray
          .filter(f => f.fieldname.startsWith(`creditFile_${index}_`))
          .map(f => f.path);

        creditos.push({
          institucionFinanciera: credito.institucionFinanciera || '',
          montoCredito: Number(credito.montoCredito || 0),
          plazoMeses: Number(credito.plazoMeses || 0),
          tasaInteresAnual: Number(credito.tasaInteresAnual || 0),
          pagoMensual: Number(credito.pagoMensual || 0),
          tieneInmuebleGarantia: credito.tieneInmuebleGarantia === 'true',
          tipoInmueble: credito.tipoInmueble || '',
          direccionInmueble: credito.direccionInmueble || '',
          valorComercial: Number(credito.valorComercial || 0),
          observaciones: credito.observaciones || '',
          archivoCredito
        });
      });
    }
    const rfcFileObj = filesArray.find(f => f.fieldname === 'rfcFile');
    const additionalDocs = filesArray
      .filter(f => f.fieldname === 'adicional')
      .map(f => f.path);
    const newPerson = new MoralPerson({
      nombre: parsedBody.nombre,
      rfc: parsedBody.rfc,
      regimenFiscal: parsedBody.regimenFiscal,
      domicilioFiscal: parsedBody.domicilioFiscal,
      fechaConstitucion: parsedBody.fechaConstitucion,
      rfcFile: rfcFileObj?.path || '',
      additionalDocs,
      creditos,
    });

    const saved = await newPerson.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar una persona moral
exports.updateMoralPerson = async (req, res) => {
  try {
    const person = await MoralPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    const filesArray = req.files || [];
    const parsedBody = parseNestedFormData(req.body);

    // Datos principales
    person.nombre = parsedBody.nombre || person.nombre;
    person.rfc = parsedBody.rfc || person.rfc;
    person.regimenFiscal = parsedBody.regimenFiscal || person.regimenFiscal;
    person.domicilioFiscal = parsedBody.domicilioFiscal || person.domicilioFiscal;
    person.fechaConstitucion = parsedBody.fechaConstitucion || person.fechaConstitucion;

    // RFC file
    const rfcFileObj = filesArray.find(f => f.fieldname === 'rfcFile');
    if (rfcFileObj) {
      person.rfcFile = rfcFileObj.path;
    }

    // Documentos adicionales (suma en lugar de reemplazo)
    const nuevosDocs = filesArray
      .filter(f => f.fieldname === 'adicional')
      .map(f => f.path);

    if (nuevosDocs.length > 0) {
      person.additionalDocs = [...(person.additionalDocs || []), ...nuevosDocs];
    }

    // Créditos financieros (conserva archivos si ya existen)
    const nuevosCreditos = [];
    if (Array.isArray(parsedBody.creditos)) {
      parsedBody.creditos.forEach((credito, index) => {
        const archivosNuevos = filesArray
          .filter(f => f.fieldname.startsWith(`creditFile_${index}_`))
          .map(f => f.path);

        let archivosAnteriores = [];

        if (credito._id) {
          const creditoExistente = person.creditos.find(c => c._id.toString() === credito._id);
          if (creditoExistente && Array.isArray(creditoExistente.archivoCredito)) {
            archivosAnteriores = creditoExistente.archivoCredito;
          }
        }


        nuevosCreditos.push({
          _id: credito._id || undefined,
          institucionFinanciera: credito.institucionFinanciera || '',
          montoCredito: Number(credito.montoCredito || 0),
          plazoMeses: Number(credito.plazoMeses || 0),
          tasaInteresAnual: Number(credito.tasaInteresAnual || 0),
          pagoMensual: Number(credito.pagoMensual || 0),
          tieneInmuebleGarantia: credito.tieneInmuebleGarantia === 'true',
          tipoInmueble: credito.tipoInmueble || '',
          direccionInmueble: credito.direccionInmueble || '',
          valorComercial: Number(credito.valorComercial || 0),
          observaciones: credito.observaciones || '',
          archivoCredito: [...archivosAnteriores, ...archivosNuevos]
        });
      });

      person.creditos = nuevosCreditos;
    }

    const updated = await person.save();
    res.json(updated);

  } catch (err) {
    console.error('❌ Error al actualizar persona moral:', err);
    res.status(400).json({ message: err.message });
  }
};


// Eliminar una persona moral
exports.deleteMoralPerson = async (req, res) => {
  try {
    await MoralPerson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Persona eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fs = require('fs');
const path = require('path');

// ✅ ELIMINAR DOCUMENTO ADICIONAL DE PERSONA MORAL
exports.deleteMoralPersonDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;

    const person = await MoralPerson.findById(id);
    if (!person) {
      return res.status(404).json({ message: 'Persona moral no encontrada' });
    }

    // 🔍 Buscar documento en additionalDocs (ruta exacta)
    const docIndex = person.additionalDocs.findIndex(d => d.endsWith(docId));
    if (docIndex === -1) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    // 🗑 Borrar archivo físico del servidor
    const filePath = path.join(person.additionalDocs[docIndex]);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 📦 Borrar del arreglo en la base de datos
    person.additionalDocs.splice(docIndex, 1);
    await person.save();

    res.json({ message: '✅ Documento eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar documento de persona moral:', error);
    res.status(500).json({ message: 'Error interno al eliminar documento', error: error.message });
  }
};
exports.deleteMoralPersonRfc = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await MoralPerson.findById(id);

    if (!person) return res.status(404).json({ message: 'Persona moral no encontrada' });

    if (!person.rfcFile) {
      return res.status(404).json({ message: 'No hay archivo de RFC para eliminar' });
    }

    // 🗑 Borrar archivo físico
    const filePath = person.rfcFile;
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🗂 Borrar referencia en Mongo
    person.rfcFile = '';
    await person.save();

    res.json({ message: '✅ RFC eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar RFC:', error);
    res.status(500).json({ message: 'Error interno al eliminar RFC', error: error.message });
  }
};


function parseNestedFormData(body) {
  const result = {};
  const arrayRegex = /^([^\[\]]+)\[(\d+)\]\[([^\[\]]+)\]$/;

  for (const key in body) {
    const value = body[key];
    const match = key.match(arrayRegex);

    if (match) {
      const [, arrayName, index, propName] = match;
      result[arrayName] = result[arrayName] || [];
      result[arrayName][index] = result[arrayName][index] || {};
      result[arrayName][index][propName] = value;
    } else if (key.includes('.')) {
      const [parent, child] = key.split('.');
      result[parent] = result[parent] || {};
      result[parent][child] = value;
    } else {
      result[key] = value;
    }
  }
  return result;
}

