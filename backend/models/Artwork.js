const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number },
  medium: { type: String },
  dimensions: { type: String },
  acquisitionDate: { type: Date },
  value: { type: Number },
  location: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Artwork', artworkSchema);