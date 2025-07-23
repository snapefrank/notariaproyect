const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');

// GET /api/documents
exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find({});
    const mapped = docs.map(doc => ({ ...doc.toObject(), id: doc._id.toString() }));
    res.json(mapped);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error al obtener documentos', error: error.message });
  }
};

// POST /api/documents (JSON sin archivo)
exports.createDocument = async (req, res) => {
  try {
    const newDoc = new Document({
      ...req.body,
      nombrePersonalizado: req.body.nombrePersonalizado || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await newDoc.save();
    res.status(201).json({ ...newDoc.toObject(), id: newDoc._id.toString() });
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error al crear documento', error: error.message });
  }
};

// PUT /api/documents/:id
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Document.findByIdAndUpdate(
      id,
      {
        ...req.body,
        nombrePersonalizado: req.body.nombrePersonalizado || '',
        updatedAt: new Date().toISOString()
      },
      { new: true }
    );

    res.json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ message: 'Error al actualizar documento', error: error.message });
  }
};

// DELETE /api/documents/:id — elimina también el archivo
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    // Eliminar archivo si existe
    if (document.fileUrl) {
      const filePath = path.join(__dirname, '..', document.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 🔥 elimina el archivo físico
      }
    }

    // Eliminar el documento en la base de datos
    await Document.findByIdAndDelete(id);

    res.json({ message: 'Documento y archivo eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ message: 'Error al eliminar documento', error: error.message });
  }
};

// POST /api/documents/upload (con archivo)
exports.uploadDocumentWithFile = async (req, res) => {
  try {
    console.log('---- SUBIDA DE DOCUMENTO ----');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    const body = { ...req.body };
    delete body._id;
    delete body.id;

    if (typeof body.tags === 'string') {
      body.tags = body.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }

    const newDoc = new Document({
      ...body,
      nombrePersonalizado: req.body.nombrePersonalizado || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileUrl: req.file ? `/uploads/documents/${req.file.filename}` : null,
    });

    const saved = await newDoc.save();
    res.status(201).json({ ...saved.toObject(), id: saved._id.toString() });

  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error al subir documento', error: error.message });
  }
};
