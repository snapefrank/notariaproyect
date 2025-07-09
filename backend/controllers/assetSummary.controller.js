const Property = require('../models/Property');
const Artwork = require('../models/Artwork');

exports.getAssetSummary = async (req, res) => {
  try {
    const properties = await Property.find();
    const artworks = await Artwork.find();

    const totalPropertyValue = properties.reduce((sum, p) => sum + (p.valor_total || 0), 0);
    const totalArtworkValue = artworks.reduce((sum, a) => sum + (a.value || 0), 0);

    res.json({
      properties: { count: properties.length, total: totalPropertyValue },
      artworks: { count: artworks.length, total: totalArtworkValue },
      otherAssets: { count: 0, total: 0 }
    });
  } catch (err) {
    console.error("❌ Error en getAssetSummary:", err);
    res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

exports.getAssetSummaryByOwner = async (req, res) => {
  try {
    const properties = await Property.find().populate({
      path: 'propietario',
      strictPopulate: false  // ← Esto permite que funcione aunque Mongoose no reconozca aún el campo
    });
    const artworks = await Artwork.find().populate({
      path: 'propietario',
      strictPopulate: false
    });

    const summaryMap = {};

    const addToSummary = (item, type) => {
      const owner = item.propietario;
      if (!owner || !owner._id) return;

      const ownerId = owner._id.toString();
      const ownerName = `${owner.nombres || owner.nombre || ''} ${owner.apellidoPaterno || ''}`.trim();

      if (!summaryMap[ownerId]) {
        summaryMap[ownerId] = {
          propietarioId: ownerId,
          nombre: ownerName || 'Sin nombre',
          inmuebles: [],
          obras: []
        };
      }

      if (type === 'inmueble') {
        summaryMap[ownerId].inmuebles.push(item);
      } else if (type === 'obra') {
        summaryMap[ownerId].obras.push(item);
      }
    };

    properties.forEach((prop) => addToSummary(prop, 'inmueble'));
    artworks.forEach((art) => addToSummary(art, 'obra'));

    const result = Object.values(summaryMap).map((owner) => ({
      propietarioId: owner.propietarioId,
      nombre: owner.nombre,
      cantidadInmuebles: owner.inmuebles.length,
      valorInmuebles: owner.inmuebles.reduce((sum, p) => sum + (p.valor_total || 0), 0),
      cantidadObras: owner.obras.length,
      valorObras: owner.obras.reduce((sum, o) => sum + (o.value || 0), 0)
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error en getAssetSummaryByOwner:", err);
    res.status(500).json({ message: 'Error interno', error: err.message });
  }
};
