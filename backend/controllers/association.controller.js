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

      additionalFiles: req.files?.additionalFiles?.map(file =>
        'uploads/associations/extra-docs/' + file.filename
      ) || [],

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
      const nuevosArchivos = req.files.additionalFiles.map(file =>
        'uploads/associations/extra-docs/' + file.filename
      );

      // Suma los nuevos a los anteriores
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
