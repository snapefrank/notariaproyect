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
    const body = req.body;

    const newPerson = new MoralPerson({
      nombre: body.nombre,
      rfc: body.rfc,
      regimenFiscal: body.regimenFiscal,
      domicilioFiscal: body.domicilioFiscal,
      fechaConstitucion: body.fechaConstitucion,
      rfcFile: req.files?.rfcFile?.[0]?.path || '',
      additionalDocs: req.files?.adicional?.map(file => file.path) || [],


      credito: {
        institucionFinanciera: body['credito.institucionFinanciera'],
        montoCredito: body['credito.montoCredito'],
        plazoMeses: body['credito.plazoMeses'],
        tasaInteresAnual: body['credito.tasaInteresAnual'],
        pagoMensual: body['credito.pagoMensual'],
        tieneInmuebleGarantia: body['credito.tieneInmuebleGarantia'] === 'true',
        inmuebleGarantia: {
          tipoInmueble: body['credito.tipoInmueble'],
          direccionInmueble: body['credito.direccionInmueble'],
          valorComercial: body['credito.valorComercial'],
          documentos: {
            escritura: req.files?.escritura?.[0]?.path || '',
            adicional: req.files?.adicional?.[0]?.path || ''
          }
        },
        observaciones: body['credito.observaciones']
      }
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


    person.credito = {
      institucionFinanciera: body['credito.institucionFinanciera'],
      montoCredito: body['credito.montoCredito'],
      plazoMeses: body['credito.plazoMeses'],
      tasaInteresAnual: body['credito.tasaInteresAnual'],
      pagoMensual: body['credito.pagoMensual'],
      tieneInmuebleGarantia: body['credito.tieneInmuebleGarantia'] === 'true',
      inmuebleGarantia: {
        tipoInmueble: body['credito.tipoInmueble'],
        direccionInmueble: body['credito.direccionInmueble'],
        valorComercial: body['credito.valorComercial'],
        documentos: {
          escritura: req.files?.escritura?.[0]?.path || person.credito?.inmuebleGarantia?.documentos?.escritura || '',
          adicional: req.files?.adicional?.[0]?.path || person.credito?.inmuebleGarantia?.documentos?.adicional || ''
        }
      },
      observaciones: body['credito.observaciones']
    };

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
