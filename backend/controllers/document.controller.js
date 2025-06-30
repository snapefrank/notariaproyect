const Document = require('../models/Document');

// GET /api/documents
exports.getAllDocuments = async (req, res) => {
  const docs = await Document.find({});
  const mapped = docs.map(doc => ({ ...doc.toObject(), id: doc._id.toString() }));
  res.json(mapped);
};

// POST /api/documents
exports.createDocument = async (req, res) => {
  const newDoc = new Document({
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  await newDoc.save();
  res.status(201).json({ ...newDoc.toObject(), id: newDoc._id.toString() });
};

// PUT /api/documents/:id
exports.updateDocument = async (req, res) => {
  const { id } = req.params;
  const updated = await Document.findByIdAndUpdate(
    id,
    {
      ...req.body,
      updatedAt: new Date().toISOString()
    },
    { new: true }
  );
  res.json({ ...updated.toObject(), id: updated._id.toString() });
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  const { id } = req.params;
  await Document.findByIdAndDelete(id);
  res.json({ message: 'Documento eliminado correctamente' });
};
