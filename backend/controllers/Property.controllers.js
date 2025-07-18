const Property = require('../models/Property');


// ✅ Normaliza la fecha a medianoche local para evitar desfases de zona horaria
const normalizeDate = (value) => {
  if (!value || value === 'undefined' || value === 'null') return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};



// GET all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate({
      path: 'propietario',
      strictPopulate: false // ← Esto evitará el error mientras Mongoose detecta el modelo actualizado
    });
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
    const extraDocs = files?.extraDocs?.map(f => f.filename) || [];

    // ✅ Leer imágenes existentes si vienen (por prevención)
    let imagenesExistentes = [];
    try {
      imagenesExistentes = body.imagenesExistentes
        ? JSON.parse(body.imagenesExistentes)
        : [];
    } catch (e) {
      console.warn('⚠️ imagenesExistentes mal formateadas en creación:', e.message);
    }

    const nuevasFotos = files?.propertyPhotos?.map(f => f.filename) || [];
    const fotosFinales = Array.from(new Set([...imagenesExistentes, ...nuevasFotos]));

    // ✅ Procesar locales con archivos
    const locals = JSON.parse(body.locals || '[]').map((local, index) => {
      const localPhotos = files?.[`localPhotos_${index}`]?.map(f => f.filename) || [];
      const rentContractFile = files?.[`localRentContract_${index}`]?.[0]?.filename || '';
      return {
        ...local,
        photos: localPhotos,
        rentContractUrl: rentContractFile
      };
    });
    locals.forEach((local, i) => {
      console.log(`📄 Local ${i + 1}: contrato recibido =>`, local.rentContractUrl || '❌ NO RECIBIDO');
    });


let propietario = undefined;
if (body.tipoPropietario !== 'Personalizado') {
  try {
    propietario = require('mongoose').Types.ObjectId(body.propietario);
  } catch (err) {
    console.warn('⚠️ ID de propietario no válido:', body.propietario);
    return res.status(400).json({ error: 'ID de propietario no válido' });
  }
}

    const newProperty = new Property({
      name: body.name,
      propietario,
      tipoPropietario: body.tipoPropietario,
      owner: body.owner || '',
      valor_total: parseFloat(body.valor_total) || 0,
      usufruct: body.usufruct,
      deedNumber: body.deedNumber,
      deedDate: normalizeDate(body.deedDate),
      deedFileUrl,
      notary: body.notary,
      cadastralKey: body.cadastralKey,
      location: Array.isArray(body.location) ? body.location[0] : String(body.location).trim(),
      totalArea: body.totalArea,
      hasEncumbrance: body.hasEncumbrance,
      encumbranceInstitution: body.encumbranceInstitution,
      encumbranceAmount: body.encumbranceAmount,
      encumbranceDate: normalizeDate(body.encumbranceDate),
      isRented: body.isRented,
      tenant: body.tenant,
      rentedArea: body.rentedArea,
      rentCost: body.rentCost,
      rentStartDate: normalizeDate(body.rentStartDate),
      rentEndDate: normalizeDate(body.rentEndDate),
      rentContractUrl,
      photos: fotosFinales,
      extraDocs,
      locals,
      status: body.status,
      soldDate: normalizeDate(body.soldDate),
      soldNote: body.soldNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: body.type
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

    console.log('🟡 req.body.imagenesExistentes:', req.body.imagenesExistentes);
    console.log('🟡 req.files.propertyPhotos:', req.files?.propertyPhotos);
    console.log('🟡 req.body.locals:', req.body.locals);


    const existing = await Property.findById(id);
    if (!existing) return res.status(404).json({ message: 'Propiedad no encontrada' });

    // ✅ Imágenes anteriores desde el frontend
    let imagenesExistentes = [];

    try {
      imagenesExistentes = body.imagenesExistentes
        ? JSON.parse(body.imagenesExistentes)
        : existing.photos || [];
    } catch (e) {
      console.warn('⚠️ imagenesExistentes inválidas:', e.message);
      imagenesExistentes = existing.photos || [];
    }

    const nuevasFotos = files?.propertyPhotos?.map(f => f.filename) || [];
    const fotosFinales = Array.from(new Set([...imagenesExistentes, ...nuevasFotos]));
    const extraDocs = files?.extraDocs?.map(f => f.filename) || existing.extraDocs || [];
    const deedFileUrl = files?.deedFile?.[0]?.filename || existing.deedFileUrl || '';
    const rentContractUrl = files?.rentContractFile?.[0]?.filename || existing.rentContractUrl || '';

    // ✅ Combinar locales
    const incomingLocals = JSON.parse(body.locals || '[]');
    const nuevosLocales = incomingLocals.map((local, index) => {
      const nuevasFotosLocal = files?.[`localPhotos_${index}`]?.map(f => f.filename) || [];

      console.log(`🟢 Fotos actuales del local ${index}:`, existing.locals?.[index]?.photos);
      console.log(`🟢 Fotos nuevas recibidas del local ${index}:`, nuevasFotosLocal);


      const fotosAnteriores = existing.locals?.[index]?.photos || [];
      const fotosFinales = Array.from(new Set([...fotosAnteriores, ...nuevasFotosLocal]));


      const rentContractFile =
        files?.[`localRentContract_${index}`]?.[0]?.filename ||
        existing.locals?.[index]?.rentContractUrl ||
        '';

      return {
        ...local,
        photos: fotosFinales,
        rentContractUrl: rentContractFile
      };
    });
    let propietario = body.propietario;
    if (body.tipoPropietario !== 'Personalizado') {
      try {
        if (typeof propietario === 'object' && propietario !== null) {
          propietario = propietario.id || propietario._id || '';
        }
        propietario = require('mongoose').Types.ObjectId(propietario);
      } catch (err) {
        console.warn('⚠️ ID de propietario no válido:', propietario);
      }
    }

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        name: body.name,
        propietario,
        tipoPropietario: body.tipoPropietario,
        valor_total: parseFloat(body.valor_total) || 0,
        usufruct: body.usufruct,
        deedNumber: body.deedNumber,
        deedDate: normalizeDate(body.deedDate),
        deedFileUrl,
        notary: body.notary,
        cadastralKey: body.cadastralKey,
        location: Array.isArray(body.location) ? body.location[0] : String(body.location).trim(),
        totalArea: body.totalArea,
        hasEncumbrance: body.hasEncumbrance,
        encumbranceInstitution: body.encumbranceInstitution,
        encumbranceAmount: isNaN(body.encumbranceAmount) ? undefined : parseFloat(body.encumbranceAmount),
        encumbranceDate: normalizeDate(body.encumbranceDate),
        status: body.status,
        soldDate: normalizeDate(body.soldDate),
        soldNote: body.soldNote,
        isRented: body.isRented,
        tenant: body.tenant,
        rentedArea: body.rentedArea,
        rentCost: body.rentCost,
        rentStartDate: normalizeDate(body.rentStartDate),
        rentEndDate: normalizeDate(body.rentEndDate),
        rentContractUrl,
        photos: fotosFinales,
        extraDocs,
        locals: nuevosLocales,
        updatedAt: new Date(),
        type: body.type,
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
// POST: Agregar un nuevo local a un inmueble existente
exports.addLocalToProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);

    console.log('🧾 Archivos recibidos al agregar local:', req.files);
    console.log('📦 Body recibido:', req.body);

    if (!property) {
      return res.status(404).json({ message: 'Inmueble no encontrado' });
    }

    const { name, tenant, rentedArea, rentCost, rentStartDate, rentEndDate } = req.body;
    const contractFile = req.files?.contract?.[0]?.filename;
    const localPhotos = req.files?.localPhotos?.map(f => f.filename) || [];

    const newLocal = {
      name,
      tenant,
      rentedArea,
      rentCost,
      rentStartDate: normalizeDate(rentStartDate),
      rentEndDate: normalizeDate(rentEndDate),
      rentContractUrl: contractFile || '',
      photos: localPhotos
    };

    property.locals.push(newLocal);
    property.updatedAt = new Date();
    await property.save();

    res.status(201).json({ message: 'Local agregado exitosamente', local: newLocal });
  } catch (error) {
    console.error('❌ Error al agregar local al inmueble:', error);
    res.status(500).json({ message: 'Error al agregar local', error: error.message });
  }
};
// PUT: Actualizar un local existente por índice
exports.updateLocalInProperty = async (req, res) => {
  try {
    const { propertyId, index } = req.params;
    const property = await Property.findById(propertyId);

    if (!property || !property.locals[index]) {
      return res.status(404).json({ message: 'Local no encontrado' });
    }

    const files = req.files;
    const {
      name,
      tenant,
      rentedArea,
      rentCost,
      rentStartDate,
      rentEndDate,
    } = req.body;

    const updatedLocal = {
      name,
      tenant,
      rentedArea,
      rentCost,
      rentStartDate,
      rentEndDate,
      rentContractUrl: files?.contract?.[0]?.filename || property.locals[index].rentContractUrl,
      photos: files?.localPhotos?.map(f => f.filename) || property.locals[index].photos,
    };

    property.locals[index] = updatedLocal;
    property.updatedAt = new Date();
    await property.save();

    res.json({ message: 'Local actualizado exitosamente', local: updatedLocal });
  } catch (error) {
    console.error('❌ Error al actualizar local:', error);
    res.status(500).json({ message: 'Error al actualizar local', error: error.message });
  }
};

// DELETE: Eliminar un local por índice
exports.deleteLocalFromProperty = async (req, res) => {
  try {
    const { propertyId, index } = req.params;
    const localIndex = parseInt(index); // 🔧 Conversión necesaria

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Inmueble no encontrado' });
    }

    if (isNaN(localIndex) || localIndex < 0 || localIndex >= property.locals.length) {
      return res.status(400).json({ message: 'Índice de local inválido' });
    }

    property.locals.splice(localIndex, 1); // elimina por índice
    property.updatedAt = new Date();
    await property.save();

    res.json({ message: 'Local eliminado correctamente', property });
  } catch (error) {
    console.error('❌ Error al eliminar local:', error);
    res.status(500).json({ message: 'Error al eliminar local', error: error.message });
  }
};
// GET: Obtener inmueble por ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('propietario') // << ESTA LÍNEA ES CLAVE
      .exec();

    res.json(property);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    res.status(500).json({ error: 'Error al obtener la propiedad' });
  }
};
// POST: Marcar como vendido y guardar documentos
exports.markAsSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { soldDate, soldNote } = req.body;

    const archivos = req.files?.map(file => file.filename) || [];

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        status: 'sold',
        soldDate: normalizeDate(soldDate),
        soldNote,
        $push: { saleDocuments: { $each: archivos } },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Inmueble no encontrado' });
    }

    res.status(200).json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (error) {
    console.error('❌ Error al marcar como vendido:', error);
    res.status(500).json({ message: 'Error al marcar como vendido', error: error.message });
  }
};




