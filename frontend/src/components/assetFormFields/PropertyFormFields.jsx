
/*import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertyFormFields = ({ formData, handleChange, handleSelectChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Propiedad</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Ingrese el nombre de la propiedad"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
          placeholder="Ingrese la dirección de la propiedad"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Propiedad</Label>
          <Select
            value={formData.type || 'residential'}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residencial</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="area">Área (m²)</Label>
          <Input
            id="area"
            name="area"
            type="number"
            value={formData.area || ''}
            onChange={handleChange}
            placeholder="Ingrese el área en m²"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Número de Registro</Label>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber || ''}
            onChange={handleChange}
            placeholder="Ingrese el número de registro"
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
      
      <div className="space-y-2">
        <Label htmlFor="value">Valor (USD)</Label>
        <Input
          id="value"
          name="value"
          type="number"
          value={formData.value || ''}
          onChange={handleChange}
          placeholder="Ingrese el valor de la propiedad"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Ingrese una descripción de la propiedad"
          rows={3}
        />
      </div>
    </>
  );
};

export default PropertyFormFields;*/
