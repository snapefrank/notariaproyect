import React, { useState } from 'react';
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


const PropertyForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    owner: initialData.owner || '',
    usufruct: initialData.usufruct || '',
    deedNumber: initialData.deedNumber || '',
    deedDate: initialData.deedDate || '',
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
  });

  // Archivos
  const [locales, setLocales] = useState(initialData.locales || []);
  const [deedFile, setDeedFile] = useState(null);
  const [rentContractFile, setRentContractFile] = useState(null);
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [extraDocs, setExtraDocs] = useState([]);

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
    const updated = [...locales];
    updated[index][field] = Array.from(files);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (deedFile) data.append('deedFile', deedFile);
    if (rentContractFile) data.append('rentContractFile', rentContractFile);
    propertyPhotos.forEach(file => data.append('propertyPhotos', file));
    extraDocs.forEach(file => data.append('extraDocs', file));

    data.append('locals', JSON.stringify(locales.map(({ photos, rentContractFile, ...rest }) => rest)));

    locales.forEach((local, index) => {
      local.photos?.forEach(file => data.append(`localPhotos_${index}`, file));
      if (local.rentContractFile?.length) {
        data.append(`localRentContract_${index}`, local.rentContractFile[0]);
      }
    });

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
            <Label>Nombre de la propiedad</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Propietario</Label>
            <Input
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              required
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
            <Label>Notarías</Label>
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

          <div>
            <Label>Ubicación</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
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
                <Label>Institución</Label>
                <Input
                  value={formData.encumbranceInstitution}
                  onChange={(e) => handleChange('encumbranceInstitution', e.target.value)}
                />
              </div>

              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={formData.encumbranceAmount}
                  onChange={(e) => handleChange('encumbranceAmount', e.target.value)}
                />
              </div>

              <div>
                <Label>Fecha</Label>
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
