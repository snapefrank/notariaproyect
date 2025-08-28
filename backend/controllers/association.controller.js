const Association = require('../models/Association');

// Obtener todas las asociaciones
exports.getAllAssociations = async (req, res) => {
  try {
    const associations = await Association.find();
    res.json(associations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva asociación
exports.createAssociation = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);
    let additionalFiles = [];

if (req.files?.additionalFiles?.length) {
  const nombres = Array.isArray(req.body.additionalFileNames)
    ? req.body.additionalFileNames
    : [req.body.additionalFileNames]; // Maneja un solo nombre también

  additionalFiles = req.files.additionalFiles.map((file, index) => ({
    nombre: nombres[index] || `Documento ${index + 1}`,
    url: 'uploads/associations/extra-docs/' + file.filename
  }));
}

    const newAssociation = new Association({
      nombre: req.body.nombre,
      apoderadoLegal: req.body.apoderadoLegal,
      numeroEscritura: req.body.numeroEscritura,
      fechaEscritura: req.body.fechaEscritura ? new Date(req.body.fechaEscritura) : null,
      regimenFiscal: req.body.regimenFiscal,
      rfc: req.body.rfc,

      deedFile: req.files?.deedFile?.[0]
        ? 'uploads/associations/deeds/' + req.files.deedFile[0].filename
        : '',

      rfcFile: req.files?.rfcFile?.[0]
        ? 'uploads/associations/rfc/' + req.files.rfcFile[0].filename
        : '',
        additionalFiles,

    });

    const saved = await newAssociation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error al crear asociación:', err);
    res.status(500).json({ message: err.message });
  }
};

// Actualizar una asociación
exports.updateAssociation = async (req, res) => {
  try {
    const association = await Association.findById(req.params.id);
    if (!association) {
      return res.status(404).json({ message: 'Asociación no encontrada' });
    }

    // Campos de texto
    association.nombre = req.body.nombre || association.nombre;
    association.apoderadoLegal = req.body.apoderadoLegal || association.apoderadoLegal;
    association.numeroEscritura = req.body.numeroEscritura || association.numeroEscritura;
    association.fechaEscritura = req.body.fechaEscritura
      ? new Date(req.body.fechaEscritura)
      : association.fechaEscritura;
    association.regimenFiscal = req.body.regimenFiscal || association.regimenFiscal;
    association.rfc = req.body.rfc || association.rfc;

    // Archivos
    if (req.files?.deedFile?.[0]) {
      association.deedFile = 'uploads/associations/deeds/' + req.files.deedFile[0].filename;
    }
    if (req.files?.rfcFile?.[0]) {
      association.rfcFile = 'uploads/associations/rfc/' + req.files.rfcFile[0].filename;
    }

if (req.files?.additionalFiles?.length) {
  const nuevosArchivos = [];
  const nombres = Array.isArray(req.body.additionalFileNames)
    ? req.body.additionalFileNames
    : [req.body.additionalFileNames];

  req.files.additionalFiles.forEach((file, index) => {
    nuevosArchivos.push({
      nombre: nombres[index] || `Documento ${association.additionalFiles.length + index + 1}`,
      url: 'uploads/associations/extra-docs/' + file.filename
    });
  });

  association.additionalFiles = [
    ...(association.additionalFiles || []),
    ...nuevosArchivos
  ];
}



    const updated = await association.save();
    res.json(updated);
  } catch (err) {
    console.error('❌ Error al actualizar asociación:', err);
    res.status(500).json({ message: err.message });
  }
};

// Eliminar una asociación
exports.deleteAssociation = async (req, res) => {
  try {
    await Association.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asociación eliminada correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar asociación:', err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener una sola asociación por ID
exports.getAssociationById = async (req, res) => {
  try {
    const association = await Association.findById(req.params.id);
    if (!association) {
      return res.status(404).json({ message: 'Asociación no encontrada' });
    }
    res.json(association);
  } catch (err) {
    console.error('❌ Error al obtener asociación por ID:', err);
    res.status(500).json({ message: err.message });
  }
};

const fs = require('fs');
const path = require('path');

// 🗑 Eliminar RFC file
exports.deleteRfcFile = async (req, res) => {
  try {
    const { id } = req.params;
    const association = await Association.findById(id);
    if (!association) return res.status(404).json({ message: 'Asociación no encontrada' });

    if (association.rfcFile) {
      const filePath = path.resolve(association.rfcFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      association.rfcFile = '';
      await association.save();
    }

    res.json({ message: 'RFC eliminado correctamente', association });
  } catch (err) {
    console.error('❌ Error al eliminar RFC:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🗑 Eliminar Escritura file
exports.deleteDeedFile = async (req, res) => {
  try {
    const { id } = req.params;
    const association = await Association.findById(id);
    if (!association) return res.status(404).json({ message: 'Asociación no encontrada' });

    if (association.deedFile) {
      const filePath = path.resolve(association.deedFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      association.deedFile = '';
      await association.save();
    }

    res.json({ message: 'Escritura eliminada correctamente', association });
  } catch (err) {
    console.error('❌ Error al eliminar escritura:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🗑 Eliminar documento adicional por índice
exports.deleteAdditionalFile = async (req, res) => {
  try {
    const { id, fileIndex } = req.params;
    const association = await Association.findById(id);
    if (!association) return res.status(404).json({ message: 'Asociación no encontrada' });

    const index = Number(fileIndex);
    if (isNaN(index) || index < 0 || index >= association.additionalFiles.length) {
      return res.status(400).json({ message: 'Índice de archivo inválido' });
    }

    // 📄 Borrar archivo físicamente
    const filePath = path.resolve(association.additionalFiles[index].url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // ❌ Eliminar del array
    association.additionalFiles.splice(index, 1);
    await association.save();

    res.json({ message: 'Documento adicional eliminado correctamente', association });
  } catch (err) {
    console.error('❌ Error al eliminar documento adicional:', err);
    res.status(500).json({ message: err.message });
  }
};