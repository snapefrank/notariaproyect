
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ArtworkFormFields = ({ formData, handleChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título de la Obra</Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Ingrese el título de la obra"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="artist">Artista</Label>
        <Input
          id="artist"
          name="artist"
          value={formData.artist || ''}
          onChange={handleChange}
          placeholder="Ingrese el nombre del artista"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Año</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year || ''}
            onChange={handleChange}
            placeholder="Ingrese el año de creación"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medium">Técnica</Label>
          <Input
            id="medium"
            name="medium"
            value={formData.medium || ''}
            onChange={handleChange}
            placeholder="Ingrese la técnica utilizada"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensiones</Label>
          <Input
            id="dimensions"
            name="dimensions"
            value={formData.dimensions || ''}
            onChange={handleChange}
            placeholder="Ingrese las dimensiones"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acquisitionDate">Fecha de Adquisición</Label>
          <Input
            id="acquisitionDate"
            name="acquisitionDate"
            type="date"
            value={formData.acquisitionDate || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Valor (USD)</Label>
          <Input
            id="value"
            name="value"
            type="number"
            value={formData.value || ''}
            onChange={handleChange}
            placeholder="Ingrese el valor de la obra"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Ingrese la ubicación actual"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Ingrese una descripción de la obra"
          rows={3}
        />
      </div>
    </>
  );
};

export default ArtworkFormFields;
