import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import axios from 'axios';
import debounce from 'lodash.debounce';
import LocationPicker from '@/components/LocationPicker';



const PropertyForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    owner: initialData.owner || '',
    valor_total: initialData.valor_total || '',
    usufruct: initialData.usufruct || '',
    deedNumber: initialData.deedNumber || '',
    deedDate: initialData.deedDate
      ? new Date(initialData.deedDate).toISOString().split('T')[0]
      : '',
    notary: initialData.notary || '',
    cadastralKey: initialData.cadastralKey || '',
    location: initialData.location || '',
    totalArea: initialData.totalArea || '',
    hasEncumbrance: initialData.hasEncumbrance || 'no',
    encumbranceInstitution: initialData.encumbranceInstitution || '',
    encumbranceAmount: initialData.encumbranceAmount || '',
    encumbranceDate: initialData.encumbranceDate || '',
    isRented: initialData.isRented || 'no',
    tenant: initialData.tenant || '',
    rentedArea: initialData.rentedArea || '',
    rentCost: initialData.rentCost || '',
    rentStartDate: initialData.rentStartDate || '',
    rentEndDate: initialData.rentEndDate || '',
    type: initialData.type || '',
    locationDetails: initialData.locationDetails || {
      address: initialData.location || '',
      coords: initialData.coords || [20.5888, -100.3899],
    },
  });

  // Archivos
  const [deedFile, setDeedFile] = useState(null);
  const [rentContractFile, setRentContractFile] = useState(null);
  const [extraDocs, setExtraDocs] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState(initialData.photos || []);
  const [locales, setLocales] = useState(initialData.locals || []); // ← usa initialData.locals
  const [propertyPhotos, setPropertyPhotos] = useState([]); // 


  // Autocompletado para propietario
  const [ownerQuery, setOwnerQuery] = useState(
    initialData.tipoPropietario === 'MoralPerson' && initialData.propietario?.razonSocial
      ? initialData.propietario.razonSocial
      : initialData.propietario?.nombres
        ? `${initialData.propietario.nombres} ${initialData.propietario.apellidoPaterno || ''} ${initialData.propietario.apellidoMaterno || ''}`.trim()
        : initialData.owner || ''
  );
  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState(
    initialData.propietario?._id || initialData.owner || ''
  );

  const normalizarTipoPropietario = (tipo) => {
    if (tipo.toLowerCase() === 'fisica' || tipo.toLowerCase() === 'física') return 'PhysicalPerson';
    if (tipo.toLowerCase() === 'moral') return 'MoralPerson';
    return tipo;
  };

  const [tipoPropietario, setTipoPropietario] = useState(
    normalizarTipoPropietario(initialData.tipoPropietario || '')
  );


  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e, setter, multiple = false) => {
    if (multiple) {
      setter(Array.from(e.target.files));
    } else {
      setter(e.target.files[0]);
    }
  };

  const handleLocalChange = (index, field, value) => {
    const updated = [...locales];
    updated[index][field] = value;
    setLocales(updated);
  };

  const handleLocalFileChange = (index, field, files) => {
    const updated = JSON.parse(JSON.stringify(locales)); // ✅ copia profunda
    updated[index][field] = Array.from(files);           // ✅ asegura nuevo array sin referencias cruzadas
    setLocales(updated);
  };


  const addLocal = () => {
    setLocales([...locales, {
      name: '',
      tenant: '',
      rentStartDate: '',
      rentEndDate: '',
      rentedArea: '',
      rentCost: '',
      rentContractFile: null,
      photos: []
    }]);
  };

  // Buscar propietarios
  const fetchOwnerSuggestions = debounce(async (query) => {
    if (!query) return setOwnerSuggestions([]);
    try {
      const res = await axios.get(`/api/search/persons?query=${query}`);
      setOwnerSuggestions(res.data);
    } catch (error) {
      console.error('Error al buscar propietarios:', error);
      setOwnerSuggestions([]);
    }
  }, 300);
  useEffect(() => {
    fetchOwnerSuggestions(ownerQuery);
  }, [ownerQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    const finalOwner = selectedOwnerId || formData.owner;

    if (!finalOwner) {
      alert("Por favor selecciona un propietario válido.");
      return;
    }
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'owner') {
        data.append(key, value);
      }
    });

    // ✅ Aquí agregas el campo `owner` con el ID correcto
    data.append('propietario', finalOwner);
    data.append('tipoPropietario', tipoPropietario);
    data.append('owner', ownerQuery); // nombre visible opcional
    // ✅ Agrega ubicación detallada si está disponible
    const { address, coords } = formData.locationDetails || {};
    const latitude = coords?.[0];
    const longitude = coords?.[1];

    data.set('location', (typeof address === 'string' ? address : address?.toString()) || '');
    data.append('latitude', latitude?.toString() || '');
    data.append('longitude', longitude?.toString() || '');

    if (deedFile) data.append('deedFile', deedFile);
    if (rentContractFile) data.append('rentContractFile', rentContractFile);

    data.append('imagenesExistentes', JSON.stringify(existingPhotos));

    propertyPhotos.forEach(file => data.append('propertyPhotos', file));
    extraDocs.forEach(file => data.append('extraDocs', file));

    data.append('locals', JSON.stringify(locales.map(({ photos, rentContractFile, ...rest }) => rest)));

    locales.forEach((local, index) => {
      local.photos?.forEach(file => data.append(`localPhotos_${index}`, file));
      if (local.rentContractFile?.length) {
        data.append(`localRentContract_${index}`, local.rentContractFile[0]);
      }
    });
    data.set('totalArea', formData.totalArea?.toString() || '');
    if (!['PhysicalPerson', 'MoralPerson'].includes(tipoPropietario)) {
      alert('Error: El tipo de propietario es inválido.');
      return;
    }
    console.log('📤 Enviando imágenes existentes del inmueble:', existingPhotos);
    console.log('📤 Enviando locales:', locales);

    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-6 max-h-[80vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre del Inmueble</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Tipo de Inmueble</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el tipo de inmueble" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residencial</SelectItem>
                <SelectItem value="commercial">Comercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="land">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Label>Propietario</Label>
            <Input
              value={ownerQuery}
              onChange={(e) => {
                setOwnerQuery(e.target.value);
                setSelectedOwnerId('');
              }}
              placeholder="Escriba el nombre del propietario"
              required
            />
            {ownerSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto shadow">
                {ownerSuggestions.map((person) => (
                  <li
                    key={person.id}
                    onClick={() => {
                      setOwnerQuery(person.name);
                      setSelectedOwnerId(person.id);
                      setTipoPropietario(normalizarTipoPropietario(person.type)); // ✔️ correcto
                      setOwnerSuggestions([]);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {person.name} ({person.type})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <Label>Valor total del inmueble</Label>
            <Input
              type="number"
              value={formData.valor_total}
              onChange={(e) => handleChange('valor_total', e.target.value)}
            />
          </div>
          <div>
            <Label>Usufructo</Label>
            <Input
              value={formData.usufruct}
              onChange={(e) => handleChange('usufruct', e.target.value)}
            />
          </div>

          <div>
            <Label>Número de escritura</Label>
            <Input
              value={formData.deedNumber}
              onChange={(e) => handleChange('deedNumber', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Fecha de escritura</Label>
            <Input
              type="date"
              value={formData.deedDate}
              onChange={(e) => handleChange('deedDate', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Subir archivo de escritura</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, setDeedFile)}
            />
          </div>

          <div>
            <Label>Notaría</Label>
            <Input
              value={formData.notary}
              onChange={(e) => handleChange('notary', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Clave catastral</Label>
            <Input
              value={formData.cadastralKey}
              onChange={(e) => handleChange('cadastralKey', e.target.value)}
              required
            />
          </div>

          <div className="col-span-2">
            <LocationPicker
              value={formData.locationDetails}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  locationDetails: val,
                }));
              }}
            />
          </div>

          <div>
            <Label>Superficie total</Label>
            <Input
              type="number"
              value={formData.totalArea}
              onChange={(e) => handleChange('totalArea', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>¿Cuenta con gravamen?</Label>
            <Select
              value={formData.hasEncumbrance}
              onValueChange={(value) => handleChange('hasEncumbrance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.hasEncumbrance === 'yes' && (
            <>
              <div>
                <Label>Institución del Gravamen</Label>
                <Input
                  value={formData.encumbranceInstitution}
                  onChange={(e) => handleChange('encumbranceInstitution', e.target.value)}
                />
              </div>

              <div>
                <Label>Monto del Gravamen</Label>
                <Input
                  type="number"
                  value={formData.encumbranceAmount}
                  onChange={(e) => handleChange('encumbranceAmount', e.target.value)}
                />
              </div>

              <div>
                <Label>Fecha del Gravamen</Label>
                <Input
                  type="date"
                  value={formData.encumbranceDate}
                  onChange={(e) => handleChange('encumbranceDate', e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <Label>¿Se renta?</Label>
            <Select
              value={formData.isRented}
              onValueChange={(value) => handleChange('isRented', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.isRented === 'yes' && (
            <>
              <div>
                <Label>Arrendatario</Label>
                <Input
                  value={formData.tenant}
                  onChange={(e) => handleChange('tenant', e.target.value)}
                />
              </div>

              <div>
                <Label>Superficie que se renta</Label>
                <Input
                  value={formData.rentedArea}
                  onChange={(e) => handleChange('rentedArea', e.target.value)}
                />
              </div>

              <div>
                <Label>Costo de la renta</Label>
                <Input
                  type="number"
                  value={formData.rentCost}
                  onChange={(e) => handleChange('rentCost', e.target.value)}
                />
              </div>

              <div>
                <Label>Inicio de renta</Label>
                <Input
                  type="date"
                  value={formData.rentStartDate}
                  onChange={(e) => handleChange('rentStartDate', e.target.value)}
                />
              </div>

              <div>
                <Label>Fin de renta</Label>
                <Input
                  type="date"
                  value={formData.rentEndDate}
                  onChange={(e) => handleChange('rentEndDate', e.target.value)}
                />
              </div>

              <div>
                <Label>Subir contrato de renta</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, setRentContractFile)}
                />
              </div>
            </>
          )}

          <div className="col-span-2">
            <Label>Fotos del inmueble</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, setPropertyPhotos, true)}
            />
          </div>

          <div className="col-span-2">
            <Label>Documentos adicionales</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => handleFileChange(e, setExtraDocs, true)}
            />
          </div>
        </div>

        <div className="col-span-2">
          {locales.map((local, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Local</Label>
                  <Input
                    value={local.name}
                    onChange={(e) => handleLocalChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Arrendatario</Label>
                  <Input
                    value={local.tenant}
                    onChange={(e) => handleLocalChange(index, 'tenant', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Superficie rentada</Label>
                  <Input
                    value={local.rentedArea}
                    onChange={(e) => handleLocalChange(index, 'rentedArea', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Costo de renta</Label>
                  <Input
                    type="number"
                    value={local.rentCost}
                    onChange={(e) => handleLocalChange(index, 'rentCost', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Inicio de renta</Label>
                  <Input
                    type="date"
                    value={local.rentStartDate}
                    onChange={(e) => handleLocalChange(index, 'rentStartDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Fin de renta</Label>
                  <Input
                    type="date"
                    value={local.rentEndDate}
                    onChange={(e) => handleLocalChange(index, 'rentEndDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Contrato de arrendamiento</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleLocalFileChange(index, 'rentContractFile', e.target.files)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Fotos del local</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleLocalFileChange(index, 'photos', e.target.files)}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="pt-4">
            <Button type="button" onClick={addLocal}>Agregar Local</Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </motion.div>
  );
};
export default PropertyForm;
