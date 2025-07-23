import React, { useState, useEffect } from 'react';
import { useArtworks } from '@/contexts/ArtworkContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { apiBase } from '@/lib/constants';

const ArtworkForm = ({ onCancel, initialData = {} }) => {
  const { addArtwork, updateArtwork } = useArtworks();

  const [formData, setFormData] = useState({
    artist: '',
    type: '',
    title: '',
    technique: '',
    year: '',
    dimensions: '',
    description: '',
    acquisitionDate: '',
    value: '',
    location: '',
    ownerId: '',
    ownerType: '',
    ownerExternalName: ''
  });

  const [certificateFile, setCertificateFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);

  const [ownerQuery, setOwnerQuery] = useState(() => {
    if (initialData.ownerType === 'MoralPerson' && initialData.ownerData?.razonSocial) {
      return initialData.ownerData.razonSocial;
    } else if (initialData.ownerType === 'PhysicalPerson' && initialData.ownerData?.nombres) {
      return `${initialData.ownerData.nombres} ${initialData.ownerData.apellidoPaterno || ''} ${initialData.ownerData.apellidoMaterno || ''}`.trim();
    } else if (initialData.ownerType === 'Personalizado' && initialData.ownerExternalName) {
      return initialData.ownerExternalName;
    } else {
      return '';
    }
  });


  const [ownerSuggestions, setOwnerSuggestions] = useState([]);

  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        artist: initialData.artist || '',
        type: initialData.type || '',
        title: initialData.title || '',
        technique: initialData.technique || '',
        year: initialData.year || '',
        dimensions: initialData.dimensions || '',
        description: initialData.description || '',
        acquisitionDate: initialData.acquisitionDate?.substring(0, 10) || '',
        value: initialData.value || '',
        location: initialData.location || '',
        ownerId: initialData.ownerId || '',
        ownerType: initialData.ownerType || '',
        ownerExternalName: initialData.ownerExternalName || ''
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchOwnerSuggestions = debounce(async (query) => {
    if (!query) return setOwnerSuggestions([]);
    try {
      const res = await axios.get(`${apiBase}/api/search/persons?query=${query}`);
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

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(formData.ownerId);

    if (formData.ownerId && isMongoId) {
      data.append('ownerId', formData.ownerId);
      data.append('ownerType', formData.ownerType);
      data.append('owner', ownerQuery);
    } else {
      data.append('ownerExternalName', ownerQuery.trim());
      data.append('ownerType', 'Personalizado');
      data.append('owner', ownerQuery.trim());
    }


    Object.entries(formData).forEach(([key, value]) => {
      if (!['ownerId', 'ownerType', 'ownerExternalName'].includes(key)) {
        data.append(key, value);
      }
    });

    if (certificateFile) data.append('certificate', certificateFile);
    photoFiles.forEach(file => data.append('photos', file));

    try {
      if (initialData._id) {
        await updateArtwork(initialData._id, data);
      } else {
        await addArtwork(data);
      }
      onCancel();
    } catch (error) {
      console.error('Error al guardar la obra:', error);
    }
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
            <Label>Nombre del Artista</Label>
            <Input value={formData.artist} onChange={e => handleChange('artist', e.target.value)} required />
          </div>

          <div>
            <Label>Tipo de Obra</Label>
            <Input value={formData.type} onChange={e => handleChange('type', e.target.value)} />
          </div>

          <div>
            <Label>Título de la Obra</Label>
            <Input value={formData.title} onChange={e => handleChange('title', e.target.value)} required />
          </div>

          <div className="md:col-span-2 relative">
            <Label>Propietario</Label>
            <Input
              value={ownerQuery}
              onChange={(e) => {
                setOwnerQuery(e.target.value);
                setFormData(prev => ({ ...prev, ownerId: '', ownerType: '', ownerExternalName: '' }));
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
                      setFormData(prev => ({
                        ...prev,
                        ownerId: person.id,
                        ownerType: person.type === 'física' ? 'PhysicalPerson' : 'MoralPerson',
                        ownerExternalName: ''
                      }));
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
            <Label>Técnica</Label>
            <Input value={formData.technique} onChange={e => handleChange('technique', e.target.value)} />
          </div>

          <div>
            <Label>Año</Label>
            <Input type="number" value={formData.year} onChange={e => handleChange('year', e.target.value)} />
          </div>

          <div>
            <Label>Medidas</Label>
            <Input value={formData.dimensions} onChange={e => handleChange('dimensions', e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Descripción</Label>
            <Textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
          </div>

          <div>
            <Label>Fecha de Adquisición</Label>
            <Input type="date" value={formData.acquisitionDate} onChange={e => handleChange('acquisitionDate', e.target.value)} />
          </div>

          <div>
            <Label>Valor</Label>
            <Input type="number" value={formData.value} onChange={e => handleChange('value', e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Ubicación</Label>
            <Input value={formData.location} onChange={e => handleChange('location', e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Certificado (PDF)</Label>
            <Input type="file" accept=".pdf" onChange={e => setCertificateFile(e.target.files[0])} />
          </div>

          <div className="md:col-span-2">
            <Label>Fotos de la Obra</Label>
            <Input type="file" accept="image/*" multiple onChange={e => setPhotoFiles(Array.from(e.target.files))} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData._id ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ArtworkForm;
