const Property = require('../models/Property');

// ===== Helpers para parsing y merge =====
const toArray = (v) => (Array.isArray(v) ? v : (v == null || v === '' ? [] : [v]));
const parseMaybeJSON = (v) => {
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch { return v; }
};
const dedupStrings = (arr=[]) => Array.from(new Set(arr.filter(Boolean)));
const alignNamesWithFiles = (names=[], filesLen=0) => {
  const out = [...names];
  while (out.length < filesLen) out.push('');
  return out.slice(0, filesLen);
};

// Nombres de extra docs para "batch" por índice (create/update property)
const getLocalExtraDocNamesByIndex = (body, index) => {
  // admite: string plano, array, o JSON stringificado en body[`localExtraDocName_${index}`]
  const raw = body[`localExtraDocName_${index}`];
  const parsed = parseMaybeJSON(raw);
  return toArray(parsed);
};

// Nombres de extra docs para endpoints de agregar/editar un local individual
const getLocalExtraDocNamesSingle = (body) => {
  const parsed = parseMaybeJSON(body.localExtraDocName);
  return toArray(parsed);
};

// ✅ Normaliza la fecha a medianoche local para evitar desfases de zona horaria
const normalizeDate = (value) => {
  if (!value || value === 'undefined' || value === 'null') return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

const parseOptionalFloat = (value) => {
  return value === undefined || value === null || value === '' ? undefined : parseFloat(value);
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
    const deedFiles = files?.deedFiles?.map(f => f.filename) || [];
    const rentContractUrl = files?.rentContractFile?.[0]?.filename || '';
    const rentContractCustomName = body.rentContractCustomName || '';
    const extraDocsFiles = files?.extraDocs?.map(f => f.filename) || [];
    const extraDocsCustomNames = Array.isArray(body.extraDocsCustomNames)
      ? body.extraDocsCustomNames
      : typeof body.extraDocsCustomNames === 'string'
        ? [body.extraDocsCustomNames]
        : [];

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
// ✅ Procesar locales con archivos
const locals = JSON.parse(body.locals || '[]').map((local, index) => {
  const localPhotos = files?.[`localPhotos_${index}`]?.map(f => f.filename) || [];
  const rentContractFile = files?.[`localRentContract_${index}`]?.[0]?.filename || '';

  // ✅ NUEVO: extra docs por local (batch)
  const extraDocsFiles = files?.[`localExtraDocs_${index}`]?.map(f => f.filename) || [];
  const extraDocNames   = alignNamesWithFiles(getLocalExtraDocNamesByIndex(body, index), extraDocsFiles.length);

  return {
    ...local,
    photos: Array.from(new Set(localPhotos)),
    rentContractUrl: rentContractFile || '',
    // ✅ NUEVO: clave catastral del local
    cadastralKey: local.cadastralKey || local.cadastralkey || '',
    // ✅ NUEVO: documentos adicionales del local
    extraDocs: {
      archivos: extraDocsFiles,
      nombresPersonalizados: extraDocNames
    }
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
    const deedCustomName = body.deedCustomName || '';

    const newProperty = new Property({
      name: body.name,
      propietario,
      tipoPropietario: body.tipoPropietario,
      owner: body.owner || '',
      valor_total: parseFloat(body.valor_total) || 0,
      usufruct: body.usufruct,
      deedNumber: body.deedNumber,
      deedDate: normalizeDate(body.deedDate),
      deed: {
        archivos: deedFiles,
        nombrePersonalizado: deedCustomName,
      },
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
      rentContractCustomName,
      photos: fotosFinales,
      extraDocs: {
        archivos: extraDocsFiles,
        nombresPersonalizados: extraDocsCustomNames
      },
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
    // 🟢 Paso 1: Cargar los actuales
    let archivosActuales = existing.extraDocs?.archivos || [];
    let nombresActuales = existing.extraDocs?.nombresPersonalizados || [];

    // 🟢 Paso 2: Nuevos archivos (si llegaron)
    const nuevosArchivos = files?.extraDocs?.map(f => f.filename) || [];
    const nuevosNombres = Array.isArray(body.extraDocsCustomNames)
      ? body.extraDocsCustomNames
      : typeof body.extraDocsCustomNames === 'string'
        ? [body.extraDocsCustomNames]
        : [];

    // 🟢 Paso 3: Si hay nuevos, se agregan
    if (nuevosArchivos.length > 0) {
      archivosActuales = [...archivosActuales, ...nuevosArchivos];
      nombresActuales = [...nombresActuales, ...nuevosNombres];
    }

    // 🟢 Paso 4: Si no hay nuevos pero sí se quieren renombrar los existentes
    if (nuevosArchivos.length === 0 && nuevosNombres.length === nombresActuales.length) {
      nombresActuales = nuevosNombres;
    }

    let escrituraActual = existing.deed?.archivos || [];
    const nuevaEscritura = files?.deedFiles?.map(f => f.filename) || [];

    if (nuevaEscritura.length > 0) {
      escrituraActual = [...escrituraActual, ...nuevaEscritura];
    }

    const deedCustomName = body.deedCustomName || existing.deed?.nombrePersonalizado || '';
    const rentContractUrl =
      files?.rentContractFile?.[0]?.filename || existing.rentContractUrl || '';
    const rentContractCustomName =
      body.rentContractCustomName || existing.rentContractCustomName || '';


// ✅ Combinar locales (fotos, contrato, clave catastral, extra docs)
const incomingLocals = JSON.parse(body.locals || '[]');
const nuevosLocales = incomingLocals.map((local, index) => {
  // Fotos
  const nuevasFotosLocal = files?.[`localPhotos_${index}`]?.map(f => f.filename) || [];
  const fotosAnteriores  = existing.locals?.[index]?.photos || [];
  const fotosFinales     = Array.from(new Set([...fotosAnteriores, ...nuevasFotosLocal]));

  // Contrato
  const rentContractFile =
    files?.[`localRentContract_${index}`]?.[0]?.filename ||
    existing.locals?.[index]?.rentContractUrl ||
    '';

  // ✅ NUEVO: extra docs por local (merge sin perder existentes)
  const prevExtraDocs  = existing.locals?.[index]?.extraDocs || { archivos: [], nombresPersonalizados: [] };
  const newExtraFiles  = files?.[`localExtraDocs_${index}`]?.map(f => f.filename) || [];
  const newExtraNames  = alignNamesWithFiles(getLocalExtraDocNamesByIndex(body, index), newExtraFiles.length);

  const mergedArchivos = dedupStrings([...(prevExtraDocs.archivos || []), ...newExtraFiles]);
  const mergedNombres  = [...(prevExtraDocs.nombresPersonalizados || []), ...newExtraNames];
  // Ajusta tamaños si hay desbalance (no obligatorio; será útil si quieres forzar paridad)
  while (mergedNombres.length < mergedArchivos.length) mergedNombres.push('');
  if (mergedNombres.length > mergedArchivos.length) mergedNombres.length = mergedArchivos.length;

  return {
    ...local,
    photos: fotosFinales,
    rentContractUrl: rentContractFile,
    // ✅ NUEVO: conserva si no vino, o usa la del body si se actualiza
    cadastralKey: (local.cadastralKey ?? local.cadastralkey) ?? existing.locals?.[index]?.cadastralKey ?? '',
    // ✅ NUEVO: merge de extra docs
    extraDocs: {
      archivos: mergedArchivos,
      nombresPersonalizados: mergedNombres
    }
  };
});


    let propietario = undefined;

    if (body.tipoPropietario !== 'Personalizado') {
      try {
        if (typeof body.propietario === 'object') {
          propietario = body.propietario._id || body.propietario.id;
        } else {
          propietario = body.propietario;
        }

        propietario = require('mongoose').Types.ObjectId(propietario);
      } catch (err) {
        console.warn('❌ ID inválido para propietario:', body.propietario);
        return res.status(400).json({ error: 'ID de propietario inválido' });
      }
    } else {
      propietario = undefined; // no se usa si es personalizado
    }

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        name: body.name,
        propietario,
        tipoPropietario: body.tipoPropietario,
        owner: body.tipoPropietario === 'Personalizado' ? body.owner : '',
        valor_total: parseOptionalFloat(body.valor_total) ?? 0,
        usufruct: body.usufruct,
        deedNumber: body.deedNumber,
        deedDate: normalizeDate(body.deedDate),
        deed: {
          archivos: escrituraActual,
          nombrePersonalizado: deedCustomName || existing.deed?.nombrePersonalizado || '',
        },
        notary: body.notary,
        cadastralKey: body.cadastralKey,
        location: Array.isArray(body.location) ? body.location[0] : body.location ? String(body.location).trim() : '',
        totalArea: parseOptionalFloat(body.totalArea),
        hasEncumbrance: body.hasEncumbrance,
        encumbranceInstitution: body.encumbranceInstitution,
        encumbranceAmount: parseOptionalFloat(body.encumbranceAmount),
        encumbranceDate: normalizeDate(body.encumbranceDate),
        status: body.status,
        soldDate: normalizeDate(body.soldDate),
        soldNote: body.soldNote,
        isRented: body.isRented,
        tenant: body.tenant,
        rentedArea: parseOptionalFloat(body.rentedArea),
        rentCost: parseOptionalFloat(body.rentCost),
        rentStartDate: normalizeDate(body.rentStartDate),
        rentEndDate: normalizeDate(body.rentEndDate),
        rentContractUrl,
        rentContractCustomName,
        photos: fotosFinales,
        extraDocs: {
          archivos: archivosActuales,
          nombresPersonalizados: nombresActuales
        },
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

    const {
      name,
      tenant,
      rentedArea,
      rentCost,
      rentStartDate,
      rentEndDate,
      cadastralKey // ✅ NUEVO
    } = req.body;

    const contractFile = req.files?.contract?.[0]?.filename || '';
    const localPhotos  = req.files?.localPhotos?.map(f => f.filename) || [];

    // ✅ NUEVO: extra docs (endpoint individual)
    const extraDocsFiles = req.files?.localExtraDocs?.map(f => f.filename) || [];
    const extraDocNames  = alignNamesWithFiles(getLocalExtraDocNamesSingle(req.body), extraDocsFiles.length);

    const newLocal = {
      name,
      tenant,
      rentedArea,
      rentCost,
      rentStartDate: normalizeDate(rentStartDate),
      rentEndDate: normalizeDate(rentEndDate),
      rentContractUrl: contractFile,
      photos: Array.from(new Set(localPhotos)),
      // ✅ NUEVO:
      cadastralKey: cadastralKey || '',
      extraDocs: {
        archivos: extraDocsFiles,
        nombresPersonalizados: extraDocNames
      }
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
// PUT: Actualizar un local existente por índice
exports.updateLocalInProperty = async (req, res) => {
  try {
    const { propertyId, index } = req.params;
    const localIndex = parseInt(index, 10);
    const property = await Property.findById(propertyId);

    if (!property || !property.locals[localIndex]) {
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
      cadastralKey // ✅ NUEVO
    } = req.body;

    const currentLocal = property.locals[localIndex];

    // Fotos: anexar a las existentes si llegan nuevas
    const nuevasFotos = files?.localPhotos?.map(f => f.filename) || [];
    const fotosFinal  = Array.from(new Set([...(currentLocal.photos || []), ...nuevasFotos]));

    // Contrato: si no llegó uno nuevo, conservar existente
    const newContract = files?.contract?.[0]?.filename || currentLocal.rentContractUrl || '';

    // ✅ NUEVO: extra docs (endpoint individual) — merge
    const prevExtra = currentLocal.extraDocs || { archivos: [], nombresPersonalizados: [] };
    const newExtraFiles = files?.localExtraDocs?.map(f => f.filename) || [];
    const newExtraNames = alignNamesWithFiles(getLocalExtraDocNamesSingle(req.body), newExtraFiles.length);

    const mergedFiles = dedupStrings([...(prevExtra.archivos || []), ...newExtraFiles]);
    const mergedNames = [...(prevExtra.nombresPersonalizados || []), ...newExtraNames];
    while (mergedNames.length < mergedFiles.length) mergedNames.push('');
    if (mergedNames.length > mergedFiles.length) mergedNames.length = mergedFiles.length;

    const updatedLocal = {
      name: (name ?? currentLocal.name),
      tenant: (tenant ?? currentLocal.tenant),
      rentedArea: (rentedArea ?? currentLocal.rentedArea),
      rentCost: (rentCost ?? currentLocal.rentCost),
      rentStartDate: normalizeDate(rentStartDate) ?? currentLocal.rentStartDate,
      rentEndDate: normalizeDate(rentEndDate) ?? currentLocal.rentEndDate,
      rentContractUrl: newContract,
      photos: fotosFinal,
      // ✅ NUEVO:
      cadastralKey: (cadastralKey ?? currentLocal.cadastralKey) || '',
      extraDocs: {
        archivos: mergedFiles,
        nombresPersonalizados: mergedNames
      }
    };

    property.locals[localIndex] = updatedLocal;
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

const fs = require('fs');
const path = require('path');

// ✅ Eliminar una foto específica de un inmueble
exports.deletePropertyPhoto = async (req, res) => {
  try {
    const { id, photoId } = req.params;

    // 🔍 Buscar propiedad
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Inmueble no encontrado' });

    // ⚠️ Validar que exista la foto en el array
    const photoIndex = property.photos.findIndex(p => p === photoId);
    if (photoIndex === -1) {
      return res.status(404).json({ message: 'Foto no encontrada en este inmueble' });
    }

    // 🗑 Borrar archivo físico
    const filePath = path.join('backend/uploads/properties/photos', property.photos[photoIndex]);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🗂 Borrar referencia de Mongo
    property.photos.splice(photoIndex, 1);
    await property.save();

    res.json({ message: 'Foto eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar foto:', error);
    res.status(500).json({ message: 'Error interno al eliminar foto', error: error.message });
  }
};

// ✅ Eliminar un documento (escritura, extraDocs, contrato de renta o venta) de un inmueble
exports.deletePropertyDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Inmueble no encontrado' });
    }

    let found = false;
    let filePath = '';

    // 🟢 1. Buscar en Escrituras
    if (property.deed?.archivos?.includes(docId)) {
      property.deed.archivos = property.deed.archivos.filter(file => file !== docId);
      filePath = path.join('backend/uploads/properties/deeds', docId);
      found = true;
    }

    // 🟢 2. Buscar en Documentos adicionales
    if (!found && property.extraDocs?.archivos?.includes(docId)) {
      const index = property.extraDocs.archivos.indexOf(docId);
      property.extraDocs.archivos.splice(index, 1);
      if (Array.isArray(property.extraDocs.nombresPersonalizados)) {
        property.extraDocs.nombresPersonalizados.splice(index, 1);
      }
      filePath = path.join('backend/uploads/properties/extra-docs', docId);
      found = true;
    }

    // 🟢 3. Buscar en Contrato de renta
    if (!found && property.rentContractUrl === docId) {
      property.rentContractUrl = '';
      property.rentContractCustomName = '';
      filePath = path.join('backend/uploads/properties/rent-contracts', docId);
      found = true;
    }

    // 🟢 4. Buscar en Documentos de venta
    if (!found && property.saleDocuments?.includes(docId)) {
      property.saleDocuments = property.saleDocuments.filter(file => file !== docId);
      filePath = path.join('backend/uploads/properties/sale-docs', docId);
      found = true;
    }

    if (!found) {
      return res.status(404).json({ message: 'Documento no encontrado en este inmueble' });
    }

    // 🗑 Eliminar archivo físico si existe
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 💾 Guardar cambios en MongoDB
    await property.save();

    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar documento:', error);
    res.status(500).json({ message: 'Error interno al eliminar documento', error: error.message });
  }
};


// GET: Obtener inmueble por ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('propietario')
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
// DELETE: Eliminar una foto específica de un local
// DELETE: Eliminar una foto específica de un local
exports.deleteLocalPhoto = async (req, res) => {
  try {
    const { propertyId, index, filename } = req.params;
    const localIndex = parseInt(index);

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Inmueble no encontrado' });

    if (isNaN(localIndex) || localIndex < 0 || localIndex >= property.locals.length) {
      return res.status(400).json({ message: 'Índice de local inválido' });
    }

    // 🔹 Filtrar la foto a eliminar
    property.locals[localIndex].photos = property.locals[localIndex].photos.filter(photo => photo !== filename);

    // 🔹 Eliminar archivo físico
    const filePath = path.join('backend/uploads/locals/photos', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await property.save();
    res.json({ message: '✅ Foto eliminada del local correctamente', property });
  } catch (error) {
    console.error('❌ Error al eliminar foto de local:', error);
    res.status(500).json({ message: 'Error al eliminar foto de local', error: error.message });
  }
};

// DELETE: Eliminar el contrato de renta de un local
exports.deleteLocalContract = async (req, res) => {
  try {
    const { propertyId, index } = req.params;
    const localIndex = parseInt(index);

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Inmueble no encontrado' });

    if (isNaN(localIndex) || localIndex < 0 || localIndex >= property.locals.length) {
      return res.status(400).json({ message: 'Índice de local inválido' });
    }

    // 🔹 Obtener contrato actual
    const contractFile = property.locals[localIndex].rentContractUrl;

    // 🔹 Limpiar contrato en DB
    property.locals[localIndex].rentContractUrl = '';

    // 🔹 Eliminar archivo físico si existe
    if (contractFile) {
      const filePath = path.join('backend/uploads/locals/contracts', contractFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await property.save();
    res.json({ message: '✅ Contrato de renta eliminado correctamente', property });
  } catch (error) {
    console.error('❌ Error al eliminar contrato de local:', error);
    res.status(500).json({ message: 'Error al eliminar contrato del local', error: error.message });
  }
};
