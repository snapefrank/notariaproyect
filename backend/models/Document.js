const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  type: String,
  category: String,
  description: String,
  createdAt: String,
  updatedAt: String,
  status: String,
  fileUrl: String,
  propertyId: String,
  artworkId: String,
  assetId: String,
  clientId: String,
  tags: [String],
  createdBy: String
});

module.exports = mongoose.model('Document', documentSchema);
