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
    if (typeof body.creditos === 'string') {
      try {
        body.creditos = JSON.parse(body.creditos);
      } catch (e) {
        console.error('❌ Error al parsear creditos JSON:', e.message);
        body.creditos = [];
      }
    }

    const filesArray = req.files || [];

    // Asociar archivos personales (RFC, CURP, NSS)
    const documentos = {};
    filesArray.forEach(file => {
      if (file.fieldname === 'rfcFile') documentos.rfc = file.path;
      if (file.fieldname === 'curpFile') documentos.curp = file.path;
      if (file.fieldname === 'nssFile') documentos.nss = file.path;
    });

    // Asociar archivos de escritura y adicional
    let escrituraPath = '';
    let adicionalPath = '';
    filesArray.forEach(file => {
      if (file.fieldname === 'escritura') escrituraPath = file.path;
      if (file.fieldname === 'adicional') adicionalPath = file.path;
    });

    // Procesar seguros médicos
    const datosMedicos = [];
    if (Array.isArray(body.datosMedicos)) {
      body.datosMedicos.forEach((seguro, index) => {
        const archivosSeguro = filesArray
          .filter(f => f.fieldname.startsWith(`insuranceFile_${index}_`))
          .map(f => f.path);

        datosMedicos.push({
          aseguradora: seguro.aseguradora || '',
          numeroPoliza: seguro.numeroPoliza || '',
          fechaInicioVigencia: seguro.fechaInicioVigencia ? new Date(seguro.fechaInicioVigencia) : null,
          fechaVencimiento: seguro.fechaVencimiento ? new Date(seguro.fechaVencimiento) : null,
          tipoSeguro: seguro.tipoSeguro || '',
          tipoSangre: seguro.tipoSangre || '',
          beneficiarios: seguro.beneficiarios || '',
          prima: seguro.prima || '',
          archivoSeguro: archivosSeguro
        });
      });
    } else if (typeof body.datosMedicos === 'object') {
      const archivosSeguro = filesArray
        .filter(f => f.fieldname.startsWith(`insuranceFile_0_`))
        .map(f => f.path);

      datosMedicos.push({
        aseguradora: body.datosMedicos.aseguradora || '',
        numeroPoliza: body.datosMedicos.numeroPoliza || '',
        fechaInicioVigencia: body.datosMedicos.fechaInicioVigencia ? new Date(body.datosMedicos.fechaInicioVigencia) : null,
        fechaVencimiento: body.datosMedicos.fechaVencimiento ? new Date(body.datosMedicos.fechaVencimiento) : null,
        tipoSeguro: body.datosMedicos.tipoSeguro || '',
        tipoSangre: body.datosMedicos.tipoSangre || '',
        beneficiarios: body.datosMedicos.beneficiarios || '',
        prima: body.datosMedicos.prima || '',
        archivoSeguro: archivosSeguro
      });
    }
    const creditos = [];
    if (Array.isArray(body.creditos)) {
      body.creditos.forEach((credito, index) => {
        const archivosCredito = filesArray
          .filter(f => f.fieldname.startsWith(`creditFile_${index}_`))
          .map(f => f.path);

        creditos.push({
          institucionFinanciera: credito.institucionFinanciera || '',
          montoCredito: Number(credito.montoCredito || 0),
          plazoMeses: Number(credito.plazoMeses || 0),
          tasaInteresAnual: Number(credito.tasaInteresAnual || 0),
          pagoMensual: Number(credito.pagoMensual || 0),
          tieneInmuebleGarantia: credito.tieneInmuebleGarantia === true || credito.tieneInmuebleGarantia === 'true',
          tipoInmueble: credito.tipoInmueble || '',
          direccionInmueble: credito.direccionInmueble || '',
          valorComercial: Number(credito.valorComercial || 0),
          observaciones: credito.observaciones || '',
          archivoCredito: archivosCredito
        });
      });
    }
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
      documentos,
      datosMedicos,
      creditos,
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

    if (typeof body.creditos === 'string') {
      try {
        body.creditos = JSON.parse(body.creditos);
      } catch (e) {
        console.error('❌ Error al parsear creditos JSON:', e.message);
        body.creditos = [];
      }
    }


    const filesArray = req.files || [];

    console.log('🧾 Datos recibidos para actualización:', body);
    console.log('🗂 Archivos recibidos:', filesArray);

    // Actualización directa de datos personales
    person.nombres = body.nombres || person.nombres;
    person.apellidoPaterno = body.apellidoPaterno || person.apellidoPaterno;
    person.apellidoMaterno = body.apellidoMaterno || person.apellidoMaterno;
    person.fechaNacimiento = body.fechaNacimiento ? new Date(body.fechaNacimiento) : person.fechaNacimiento;
    person.rfc = typeof body.rfc === 'string' ? body.rfc : person.rfc;
    person.curp = typeof body.curp === 'string' ? body.curp : person.curp;
    person.nss = typeof body.nss === 'string' ? body.nss : person.nss;
    person.direccion = body.direccion || person.direccion;
    person.sexo = body.sexo || person.sexo;

    // Documentos personales
    const documentos = {
      rfc: person.documentos?.rfc,
      curp: person.documentos?.curp,
      nss: person.documentos?.nss
    };
    filesArray.forEach(file => {
      if (file.fieldname === 'rfcFile') documentos.rfc = file.path;
      if (file.fieldname === 'curpFile') documentos.curp = file.path;
      if (file.fieldname === 'nssFile') documentos.nss = file.path;
    });
    person.documentos = documentos;

    // Escritura y documento adicional
    let escrituraPath = person.credito?.inmuebleGarantia?.documentos?.escritura || '';
    let adicionalPath = person.credito?.inmuebleGarantia?.documentos?.adicional || '';
    filesArray.forEach(file => {
      if (file.fieldname === 'escritura') escrituraPath = file.path;
      if (file.fieldname === 'adicional') adicionalPath = file.path;
    });

    // Procesar seguros médicos actualizados
    const nuevosSeguros = [];
    if (Array.isArray(body.datosMedicos)) {
      body.datosMedicos.forEach((seguro, index) => {
        const archivos = filesArray
          .filter(f => f.fieldname.startsWith(`insuranceFile_${index}_`))
          .map(f => f.path);

        nuevosSeguros.push({
          aseguradora: seguro.aseguradora || '',
          numeroPoliza: seguro.numeroPoliza || '',
          fechaInicioVigencia: seguro.fechaInicioVigencia ? new Date(seguro.fechaInicioVigencia) : null,
          fechaVencimiento: seguro.fechaVencimiento ? new Date(seguro.fechaVencimiento) : null,
          tipoSeguro: seguro.tipoSeguro || '',
          tipoSangre: seguro.tipoSangre || '',
          beneficiarios: seguro.beneficiarios || '',
          prima: seguro.prima || '',
          archivoSeguro: archivos
        });
      });
    } else if (typeof body.datosMedicos === 'object') {
      const archivos = filesArray
        .filter(f => f.fieldname.startsWith(`insuranceFile_0_`))
        .map(f => f.path);

      nuevosSeguros.push({
        aseguradora: body.datosMedicos.aseguradora || '',
        numeroPoliza: body.datosMedicos.numeroPoliza || '',
        fechaInicioVigencia: body.datosMedicos.fechaInicioVigencia ? new Date(body.datosMedicos.fechaInicioVigencia) : null,
        fechaVencimiento: body.datosMedicos.fechaVencimiento ? new Date(body.datosMedicos.fechaVencimiento) : null,
        tipoSeguro: body.datosMedicos.tipoSeguro || '',
        tipoSangre: body.datosMedicos.tipoSangre || '',
        beneficiarios: body.datosMedicos.beneficiarios || '',
        prima: body.datosMedicos.prima || '',
        archivoSeguro: archivos
      });
    }

    // Sustituir por completo o agregar al arreglo existente
    if (nuevosSeguros.length > 0) {
      person.datosMedicos = nuevosSeguros;
    }

    // Actualizar crédito
    // Procesar créditos financieros actualizados
    const nuevosCreditos = [];
    if (Array.isArray(body.creditos)) {
      body.creditos.forEach((credito, index) => {
        const archivoCredito = filesArray
          .filter(f => f.fieldname.startsWith(`creditFile_${index}_`))
          .map(f => f.path);

        nuevosCreditos.push({
          institucionFinanciera: credito.institucionFinanciera || '',
          montoCredito: Number(credito.montoCredito || 0),
          plazoMeses: Number(credito.plazoMeses || 0),
          tasaInteresAnual: Number(credito.tasaInteresAnual || 0),
          pagoMensual: Number(credito.pagoMensual || 0),
          tieneInmuebleGarantia: credito.tieneInmuebleGarantia === true || credito.tieneInmuebleGarantia === 'true',
          tipoInmueble: credito.tipoInmueble || '',
          direccionInmueble: credito.direccionInmueble || '',
          valorComercial: Number(credito.valorComercial || 0),
          observaciones: credito.observaciones || '',
          archivoCredito
        });
      });
    }
    else if (typeof body.creditos === 'object') {
      const archivoCredito = filesArray
        .filter(f => f.fieldname.startsWith(`creditFile_0_`))
        .map(f => f.path);

      nuevosCreditos.push({
        institucionFinanciera: body.creditos.institucionFinanciera || '',
        montoCredito: Number(body.creditos.montoCredito || 0),
        plazoMeses: Number(body.creditos.plazoMeses || 0),
        tasaInteresAnual: Number(body.creditos.tasaInteresAnual || 0),
        pagoMensual: Number(body.creditos.pagoMensual || 0),
        tieneInmuebleGarantia: body.creditos.tieneInmuebleGarantia === 'true',
        tipoInmueble: body.creditos.tipoInmueble || '',
        direccionInmueble: body.creditos.direccionInmueble || '',
        valorComercial: Number(body.creditos.valorComercial || 0),
        observaciones: body.creditos.observaciones || '',
        archivoCredito
      });
    }

    if (nuevosCreditos.length > 0) {
      person.creditos = nuevosCreditos;
    }


    const updated = await person.save();
    res.json(updated);

  } catch (err) {
    console.error('❌ Error al actualizar persona física:', err);
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


    if (Array.isArray(person.datosMedicos)) {
      person.datosMedicos.forEach(seguro => {
        if (seguro.archivoSeguro) archivos.push(seguro.archivoSeguro);
      });
    }

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