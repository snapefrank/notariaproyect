const PhysicalPerson = require('../models/PhysicalPerson');
const fs = require('fs');
const path = require('path');


// Obtener todas las personas físicas
const getAllPhysicalPersons = async (req, res) => {
  try {
    const persons = await PhysicalPerson.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una persona física por ID
const getPhysicalPersonById = async (req, res) => {
  try {
    const person = await PhysicalPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    res.json(person); // ✅ Aquí está la corrección
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Crear una nueva persona física

const createPhysicalPerson = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);
    const body = parseNestedFormData(req.body);


    // Verifica que estos accesos existan antes de usarlos
    const escrituraPath = req.files?.escritura?.[0]?.path || '';
    const adicionalPath = req.files?.adicional?.[0]?.path || '';
    const rfcPath = req.files?.rfcFile?.[0]?.path || '';
    const curpPath = req.files?.curpFile?.[0]?.path || '';
    const nssPath = req.files?.nssFile?.[0]?.path || '';

    const newPerson = new PhysicalPerson({
      nombres: body.nombres,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno,
      fechaNacimiento: body.fechaNacimiento ? new Date(body.fechaNacimiento) : undefined,
      rfc: body.rfc,
      curp: body.curp,
      nss: body.nss,
      direccion: body.direccion,
      sexo: body.sexo,
      documentos: {
        rfc: rfcPath,
        curp: curpPath,
        nss: nssPath,
      },
      insuranceDocuments: req.files?.insuranceFile?.map(file => file.path) || [],
      datosMedicos: {
        tipoSangre: body.datosMedicos?.tipoSangre || '',
        aseguradora: body.datosMedicos?.aseguradora || '',
        tipoSeguro: body.datosMedicos?.tipoSeguro || '',
        beneficiarios: body.datosMedicos?.beneficiarios || '',
        fechaInicioVigencia: body.datosMedicos?.fechaInicioVigencia ? new Date(body.datosMedicos.fechaInicioVigencia) : undefined,
        fechaVencimiento: body.datosMedicos?.fechaVencimiento ? new Date(body.datosMedicos.fechaVencimiento) : undefined,
        numeroPoliza: body.datosMedicos?.numeroPoliza || '',
        prima: body.datosMedicos?.prima || ''
      },
      credito: {
        institucionFinanciera: body.credito?.institucionFinanciera || '',
        montoCredito: Number(body.credito?.montoCredito || 0),
        plazoMeses: Number(body.credito?.plazoMeses || 0),
        tasaInteresAnual: Number(body.credito?.tasaInteresAnual || 0),
        pagoMensual: Number(body.credito?.pagoMensual || 0),
        tieneInmuebleGarantia: body.credito?.tieneInmuebleGarantia === 'true',
        tipoInmueble: body.credito?.tipoInmueble || '',
        direccionInmueble: body.credito?.direccionInmueble || '',
        valorComercial: Number(body.credito?.valorComercial || 0),
        observaciones: body.credito?.observaciones || '',
        inmuebleGarantia: {
          documentos: {
            escritura: escrituraPath,
            adicional: adicionalPath
          }
        }
      }
    });


    const saved = await newPerson.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error al crear persona física:', err);
    res.status(500).json({
      message: 'Error interno al guardar persona física',
      error: err.message
    });
  }
};


// Actualizar una persona física
const updatePhysicalPerson = async (req, res) => {
  try {
    const person = await PhysicalPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    const body = parseNestedFormData(req.body);
    console.log('🧾 Datos recibidos para actualización:', body);
    console.log('🗂 Archivos:', req.files);


    person.nombres = body.nombres || person.nombres;
    person.apellidoPaterno = body.apellidoPaterno || person.apellidoPaterno;
    person.apellidoMaterno = body.apellidoMaterno || person.apellidoMaterno;
    person.fechaNacimiento = body.fechaNacimiento ? new Date(body.fechaNacimiento) : person.fechaNacimiento;
    person.rfc = typeof body.rfc === 'string' ? body.rfc : person.rfc;
    person.curp = typeof body.curp === 'string' ? body.curp : person.curp;
    person.nss = typeof body.nss === 'string' ? body.nss : person.nss;
    person.direccion = body.direccion || person.direccion;
    person.sexo = body.sexo || person.sexo;
    person.documentos = {
      rfc: req.files?.rfcFile?.[0]?.path || person.documentos?.rfc || '',
      curp: req.files?.curpFile?.[0]?.path || person.documentos?.curp || '',
      nss: req.files?.nssFile?.[0]?.path || person.documentos?.nss || '',
    };
    person.insuranceDocuments = req.files?.insuranceFile
      ? req.files.insuranceFile.map(file => file.path)
      : person.insuranceDocuments || [];
    person.datosMedicos = {
      tipoSangre: body.datosMedicos?.tipoSangre || '',
      aseguradora: body.datosMedicos?.aseguradora || '',
      tipoSeguro: body.datosMedicos?.tipoSeguro || '',
      beneficiarios: body.datosMedicos?.beneficiarios || '',
      fechaInicioVigencia: body.datosMedicos?.fechaInicioVigencia ? new Date(body.datosMedicos.fechaInicioVigencia) : null,
      fechaVencimiento: body.datosMedicos?.fechaVencimiento ? new Date(body.datosMedicos.fechaVencimiento) : null,
      numeroPoliza: body.datosMedicos?.numeroPoliza || '',
      prima: body.datosMedicos?.prima || ''
    };

    person.credito = {
      institucionFinanciera: body.credito?.institucionFinanciera || '',
      montoCredito: Number(body.credito?.montoCredito || 0),
      plazoMeses: Number(body.credito?.plazoMeses || 0),
      tasaInteresAnual: Number(body.credito?.tasaInteresAnual || 0),
      pagoMensual: Number(body.credito?.pagoMensual || 0),
      tieneInmuebleGarantia: body.credito?.tieneInmuebleGarantia === 'true',
      tipoInmueble: body.credito?.tipoInmueble || '',
      direccionInmueble: body.credito?.direccionInmueble || '',
      valorComercial: Number(body.credito?.valorComercial || 0),
      observaciones: body.credito?.observaciones || '',
      inmuebleGarantia: {
        documentos: {
          escritura: req.files?.escritura?.[0]?.path || person.credito?.inmuebleGarantia?.documentos?.escritura || '',
          adicional: req.files?.adicional?.[0]?.path || person.credito?.inmuebleGarantia?.documentos?.adicional || ''
        }
      }
    };


    const updated = await person.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Eliminar una persona física
const deletePhysicalPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await PhysicalPerson.findById(id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    // Extrae las rutas de archivos a eliminar
    const archivos = [];

    if (person.documentos?.rfc) archivos.push(person.documentos.rfc);
    if (person.documentos?.curp) archivos.push(person.documentos.curp);
    if (person.documentos?.nss) archivos.push(person.documentos.nss);
    if (person.credito?.inmuebleGarantia?.documentos?.escritura)
      archivos.push(person.credito.inmuebleGarantia.documentos.escritura);
    if (person.credito?.inmuebleGarantia?.documentos?.adicional)
      archivos.push(person.credito.inmuebleGarantia.documentos.adicional);
    if (person.insuranceDocument) archivos.push(person.insuranceDocument);


    // Elimina los archivos físicamente
    deleteFiles(archivos);

    // Elimina la persona de la base de datos
    await PhysicalPerson.findByIdAndDelete(id);

    res.status(200).json({ message: 'Persona y archivos eliminados exitosamente' });

  } catch (error) {
    console.error('❌ Error al eliminar persona:', error);
    res.status(500).json({ message: 'Error al eliminar persona', error: error.message });
  }
};


// Subir archivos de RFC, CURP y NSS
const uploadDocuments = async (req, res) => {
  try {
    console.log('ARCHIVOS RECIBIDOS:', req.files);
    console.log('PARAM ID:', req.params.id);
    const { id } = req.params;

    const updates = {};
    if (req.files?.rfcFile) updates.rfcFile = req.files.rfcFile[0].path;
    if (req.files?.curpFile) updates.curpFile = req.files.curpFile[0].path;
    if (req.files?.nssFile) updates.nssFile = req.files.nssFile[0].path;

    const updatedPerson = await PhysicalPerson.findByIdAndUpdate(id, updates, { new: true });

    res.json({ message: 'Documentos subidos correctamente', data: updatedPerson });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ message: 'Error al subir documentos', error: error.message });
  }
};

function parseNestedFormData(body) {
  const result = {};
  for (const key in body) {
    const keys = key.split('.');
    if (keys.length === 2) {
      const [parent, child] = keys;
      result[parent] = result[parent] || {};
      result[parent][child] = body[key];
    } else {
      result[key] = body[key];
    }
  }
  return result;
}

function deleteFiles(filePaths = []) {
  filePaths.forEach(file => {
    if (file && fs.existsSync(file)) {
      fs.unlink(file, err => {
        if (err) console.error(`❌ Error al eliminar archivo: ${file}`, err);
        else console.log(`✅ Archivo eliminado: ${file}`);
      });
    }
  });
}


module.exports = {
  getAllPhysicalPersons,
  getPhysicalPersonById,
  createPhysicalPerson,
  updatePhysicalPerson,
  deletePhysicalPerson,
  uploadDocuments
};