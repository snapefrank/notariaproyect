
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OtherAssetFormFields = ({ formData, handleChange, handleSelectChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Activo</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Ingrese el nombre del activo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Activo</Label>
        <Select
          value={formData.type || 'collection'}
          onValueChange={(value) => handleSelectChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="collection">Colección</SelectItem>
            <SelectItem value="vehicle">Vehículo</SelectItem>
            <SelectItem value="jewelry">Joyería</SelectItem>
            <SelectItem value="furniture">Mobiliario</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity || ''}
            onChange={handleChange}
            placeholder="Ingrese la cantidad"
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
            placeholder="Ingrese el valor del activo"
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
          placeholder="Ingrese una descripción del activo"
          rows={3}
        />
      </div>
    </>
  );
};

export default OtherAssetFormFields;
