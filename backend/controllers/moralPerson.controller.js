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
    const newPerson = new MoralPerson({
      nombre: parsedBody.nombre,
      rfc: parsedBody.rfc,
      regimenFiscal: parsedBody.regimenFiscal,
      domicilioFiscal: parsedBody.domicilioFiscal,
      fechaConstitucion: parsedBody.fechaConstitucion,
      rfcFile: req.files?.rfcFile?.[0]?.path || '',
      additionalDocs: req.files?.adicional?.map(file => file.path) || [],
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

    const body = req.body;

    person.nombre = body.nombre || person.nombre;
    person.rfc = body.rfc || person.rfc;
    person.regimenFiscal = body.regimenFiscal || person.regimenFiscal;
    person.domicilioFiscal = body.domicilioFiscal || person.domicilioFiscal;
    person.fechaConstitucion = body.fechaConstitucion || person.fechaConstitucion;
    if (req.files?.rfcFile?.[0]) {
      person.rfcFile = req.files.rfcFile[0].path;
    }

    if (req.files?.adicional) {
      person.additionalDocs = req.files.adicional.map(file => file.path);
    }


    const filesArray = req.files || [];
    const parsedBody = parseNestedFormData(body);
    const nuevosCreditos = [];

    if (Array.isArray(parsedBody.creditos)) {
      parsedBody.creditos.forEach((credito, index) => {
        const archivoCredito = filesArray
          .filter(f => f.fieldname.startsWith(`creditFile_${index}_`))
          .map(f => f.path);

        nuevosCreditos.push({
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

    if (nuevosCreditos.length > 0) {
      person.creditos = nuevosCreditos;
    }


    const updated = await person.save();
    res.json(updated);
  } catch (err) {
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

