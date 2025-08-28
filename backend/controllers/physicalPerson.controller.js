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

    // Procesar documentos personales adicionales con NOMBRE editable
    const norm = (p) => p.replace(/\\/g, '/'); // para Windows -> Linux
    const extraFiles = filesArray.filter(f => f.fieldname === 'additionalDocs');

    // Acepta: documentosAdicionalesNombres[] (array) o documentosAdicionalesNombres (string)
    let extraNames = req.body['documentosAdicionalesNombres[]'] ?? req.body.documentosAdicionalesNombres ?? [];
    if (!Array.isArray(extraNames)) extraNames = [extraNames];

    const documentosAdicionales = extraFiles.map((file, idx) => ({
      nombre: (extraNames[idx] && String(extraNames[idx]).trim()) || file.originalname,
      url: norm(file.path)
    }));



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
      documentosAdicionales
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


    // Actualización directa de datos personales
    person.nombres = body.nombres || person.nombres;
    person.apellidoPaterno = body.apellidoPaterno || person.apellidoPaterno;
    person.apellidoMaterno = body.apellidoMaterno || person.apellidoMaterno;
    person.fechaNacimiento = body.fechaNacimiento ? new Date(body.fechaNacimiento) : person.fechaNacimiento;
    person.rfc = Array.isArray(body.rfc) ? body.rfc[0] : body.rfc || person.rfc;
    person.curp = Array.isArray(body.curp) ? body.curp[0] : body.curp || person.curp;
    person.nss = Array.isArray(body.nss) ? body.nss[0] : body.nss || person.nss;
    person.direccion = body.direccion || person.direccion;
    person.sexo = body.sexo || person.sexo;

    // Documentos personales
    const documentos = {
      rfc: person.documentos?.rfc,
      curp: person.documentos?.curp,
      nss: person.documentos?.nss
    };
    filesArray.forEach(file => {
      if (file.fieldname === 'rfcFile') {
        if (documentos.rfc && fs.existsSync(documentos.rfc)) fs.unlinkSync(documentos.rfc);
        documentos.rfc = file.path;
      }
      if (file.fieldname === 'curpFile') {
        if (documentos.curp && fs.existsSync(documentos.curp)) fs.unlinkSync(documentos.curp);
        documentos.curp = file.path;
      }
      if (file.fieldname === 'nssFile') {
        if (documentos.nss && fs.existsSync(documentos.nss)) fs.unlinkSync(documentos.nss);
        documentos.nss = file.path;
      }
    });
    person.documentos = documentos;

    // Procesar nuevos documentos personales adicionales con NOMBRE editable
    const norm = (p) => p.replace(/\\/g, '/');
    const extraFilesU = filesArray.filter(f => f.fieldname === 'additionalDocs');

    let extraNamesU = req.body['documentosAdicionalesNombres[]'] ?? req.body.documentosAdicionalesNombres ?? [];
    if (!Array.isArray(extraNamesU)) extraNamesU = [extraNamesU];

    const nuevosDocs = extraFilesU.map((file, idx) => ({
      nombre: (extraNamesU[idx] && String(extraNamesU[idx]).trim()) || file.originalname,
      url: norm(file.path)
    }));
    // Merge de documentos adicionales (sin duplicar)
    const existentes = Array.isArray(person.documentosAdicionales)
      ? person.documentosAdicionales
      : [];

    let merged = [...existentes, ...nuevosDocs];

    // (Opcional pero recomendado) de-dup por url+nombre
    const seen = new Set();
    merged = merged.filter(d => {
      const key = `${d?.url || ''}|${d?.nombre || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    person.documentosAdicionales = merged;


    const nuevosSeguros = [];

    if (Array.isArray(body.datosMedicos)) {
      body.datosMedicos.forEach((seguro, index) => {
        const archivosNuevos = filesArray
          .filter(f => f.fieldname.startsWith(`insuranceFile_${index}_`))
          .map(f => f.path);

        // Buscar archivos anteriores por _id del seguro
        let archivosAnteriores = [];
        if (seguro._id && Array.isArray(person.datosMedicos)) {
          const seguroExistente = person.datosMedicos.find(s => s._id.toString() === seguro._id);
          if (seguroExistente && Array.isArray(seguroExistente.archivoSeguro)) {
            archivosAnteriores = seguroExistente.archivoSeguro;
          }
        }

        nuevosSeguros.push({
          ...seguro,
          archivoSeguro: [...archivosAnteriores, ...archivosNuevos]
        });
      });

      person.datosMedicos = nuevosSeguros;
    }


    const nuevosCreditos = [];
    if (Array.isArray(body.creditos)) {
      body.creditos.forEach((credito, index) => {
        const archivos = filesArray.filter(f => f.fieldname.startsWith(`creditFile_${index}_`)).map(f => f.path);
        const archivosAnteriores = Array.isArray(credito.archivoCredito) ? credito.archivoCredito : [];
        nuevosCreditos.push({
          ...credito,
          archivoCredito: [...archivosAnteriores, ...archivos]
        });
      });
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
// ✅ Eliminar un documento específico de una persona física
const deletePhysicalPersonDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const person = await PhysicalPerson.findById(id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    let eliminado = false;

    // 📄 1. Eliminar RFC, CURP o NSS (si coincide la ruta exacta)
    for (let key of ['rfc', 'curp', 'nss']) {
      if (person.documentos?.[key] && person.documentos[key].includes(docId)) {
        // 🗑 Borra archivo físico
        if (fs.existsSync(person.documentos[key])) fs.unlinkSync(person.documentos[key]);
        // ❌ Borra referencia en Mongo
        person.documentos[key] = '';
        eliminado = true;
      }
    }

    // 📄 2. Eliminar documentos adicionales
    if (!eliminado && Array.isArray(person.documentosAdicionales)) {
      const docIndex = person.documentosAdicionales.findIndex(d => d.url.includes(docId));
      if (docIndex !== -1) {
        const doc = person.documentosAdicionales[docIndex];
        if (fs.existsSync(doc.url)) fs.unlinkSync(doc.url);
        person.documentosAdicionales.splice(docIndex, 1);
        eliminado = true;
      }
    }

    if (!eliminado) {
      return res.status(404).json({ message: 'Documento no encontrado en esta persona física' });
    }

    await person.save();
    res.json({ message: 'Documento eliminado correctamente' });

  } catch (error) {
    console.error('❌ Error al eliminar documento de persona física:', error);
    res.status(500).json({ message: 'Error al eliminar documento', error: error.message });
  }
};

// ✅ Nueva función independiente para eliminar archivos de seguros o créditos
const deletePhysicalPersonFileFromArray = async (req, res) => {
  try {
    const { id, type, mainIndex, fileIndex } = req.params;
    const person = await PhysicalPerson.findById(id);
    if (!person) return res.status(404).json({ error: 'Persona no encontrada' });

    let filePath = '';

    if (type === 'insurance') {
      const archivo = person.datosMedicos?.[mainIndex]?.archivoSeguro?.[fileIndex];

      if (!archivo) return res.status(404).json({ error: 'Archivo de seguro no encontrado' });

      filePath = typeof archivo === 'string' ? archivo : archivo.url || archivo.archivo || '';
      person.datosMedicos[mainIndex].archivoSeguro.splice(fileIndex, 1);

    } else if (type === 'credit') {
      const archivo = person.creditos?.[mainIndex]?.archivoCredito?.[fileIndex];

      if (!archivo) return res.status(404).json({ error: 'Archivo de crédito no encontrado' });

      filePath = typeof archivo === 'string' ? archivo : archivo.url || archivo.archivo || '';
      person.creditos[mainIndex].archivoCredito.splice(fileIndex, 1);

    } else {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    // ✅ Elimina el archivo físico si existe
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ Archivo físico eliminado:', filePath);
    } else {
      console.warn('⚠️ Ruta inválida o archivo no existe:', filePath);
    }

    await person.save();
    res.json({ message: 'Archivo eliminado correctamente' });

  } catch (error) {
    console.error('❌ Error al eliminar archivo anidado:', error);
    res.status(500).json({ error: 'Error al eliminar archivo anidado' });
  }
};



module.exports = {
  getAllPhysicalPersons,
  getPhysicalPersonById,
  createPhysicalPerson,
  updatePhysicalPerson,
  deletePhysicalPerson,
  uploadDocuments,
  deletePhysicalPersonDocument,
  deletePhysicalPersonFileFromArray
};