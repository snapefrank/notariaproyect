const Property = require('../models/Property');

// GET all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({});
    const mapped = properties.map(p => ({ ...p.toObject(), id: p._id.toString() }));
    res.json(mapped);
  } catch (err) {
    console.error('❌ Error al obtener propiedades:', err);
    res.status(500).json({ message: 'Error al obtener propiedades', error: err.message });
  }
};

// POST new property
exports.createProperty = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files;

    const deedFileUrl = files?.deedFile?.[0]?.filename || '';
    const rentContractUrl = files?.rentContractFile?.[0]?.filename || '';
    const propertyPhotos = files?.propertyPhotos?.map(f => f.filename) || [];
    const extraDocs = files?.extraDocs?.map(f => f.filename) || [];

    // Procesar locales
    const locals = JSON.parse(body.locals || '[]').map((local, index) => {
      const localPhotos = files?.[`localPhotos_${index}`]?.map(f => f.filename) || [];
      const rentContractFile = files?.[`localRentContract_${index}`]?.[0]?.filename || '';
      return {
        ...local,
        photos: localPhotos,
        rentContractUrl: rentContractFile
      };
    });

    const newProperty = new Property({
      name: body.name,
      owner: body.owner,
      usufruct: body.usufruct,
      deedNumber: body.deedNumber,
      deedDate: body.deedDate,
      deedFileUrl,
      notary: body.notary,
      cadastralKey: body.cadastralKey,
      location: body.location,
      totalArea: body.totalArea,
      hasEncumbrance: body.hasEncumbrance,
      encumbranceInstitution: body.encumbranceInstitution,
      encumbranceAmount: body.encumbranceAmount,
      encumbranceDate: body.encumbranceDate,
      status: body.status,
      soldDate: body.soldDate,
      soldNote: body.soldNote,
      isRented: body.isRented,
      tenant: body.tenant,
      rentedArea: body.rentedArea,
      rentCost: body.rentCost,
      rentStartDate: body.rentStartDate,
      rentEndDate: body.rentEndDate,
      rentContractUrl,
      photos: propertyPhotos,
      extraDocs,
      locals,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newProperty.save();
    res.status(201).json({ ...newProperty.toObject(), id: newProperty._id.toString() });
  } catch (err) {
    console.error('❌ Error al crear propiedad:', err);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// PUT update property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const files = req.files;

    const deedFileUrl = files?.deedFile?.[0]?.filename || body.deedFileUrl;
    const rentContractUrl = files?.rentContractFile?.[0]?.filename || body.rentContractUrl;
    const propertyPhotos = files?.propertyPhotos?.map(f => f.filename) || body.photos || [];
    const extraDocs = files?.extraDocs?.map(f => f.filename) || body.extraDocs || [];

    // Procesar locales
    const locals = JSON.parse(body.locals || '[]').map((local, index) => {
      const localPhotos = files?.[`localPhotos_${index}`]?.map(f => f.filename) || local.photos || [];
      const rentContractFile = files?.[`localRentContract_${index}`]?.[0]?.filename || local.rentContractUrl || '';
      return {
        ...local,
        photos: localPhotos,
        rentContractUrl: rentContractFile
      };
    });

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        name: body.name,
        owner: body.owner,
        usufruct: body.usufruct,
        deedNumber: body.deedNumber,
        deedDate: body.deedDate,
        deedFileUrl,
        notary: body.notary,
        cadastralKey: body.cadastralKey,
        location: body.location,
        totalArea: body.totalArea,
        hasEncumbrance: body.hasEncumbrance,
        encumbranceInstitution: body.encumbranceInstitution,
        encumbranceAmount: body.encumbranceAmount,
        encumbranceDate: body.encumbranceDate,
        status: body.status,
        soldDate: body.soldDate,
        soldNote: body.soldNote,
        isRented: body.isRented,
        tenant: body.tenant,
        rentedArea: body.rentedArea,
        rentCost: body.rentCost,
        rentStartDate: body.rentStartDate,
        rentEndDate: body.rentEndDate,
        rentContractUrl,
        photos: propertyPhotos,
        extraDocs,
        locals,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (err) {
    console.error('❌ Error al actualizar propiedad:', err);
    res.status(500).json({ message: 'Error al actualizar propiedad', error: err.message });
  }
};

// DELETE property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.json({ message: 'Inmueble eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar propiedad:', err);
    res.status(500).json({ message: 'Error al eliminar propiedad', error: err.message });
  }
};

// Update only contract file
exports.updatePropertyContract = async (id, contractPath) => {
  const updated = await Property.findByIdAndUpdate(
    id,
    { rentContractUrl: contractPath, updatedAt: new Date() },
    { new: true }
  );

  return { ...updated.toObject(), id: updated._id.toString() };
};
