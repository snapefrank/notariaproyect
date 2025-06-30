import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const MoralPersonForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    regimenFiscal: '',
    domicilioFiscal: '',
    fechaConstitucion: '',
  });

  // Cargar datos iniciales si se proporciona initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        rfc: initialData.rfc || '',
        regimenFiscal: initialData.regimenFiscal || '',
        domicilioFiscal: initialData.domicilioFiscal || '',
        fechaConstitucion: initialData.fechaConstitucion?.split('T')[0] || '', // Formato YYYY-MM-DD
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre o Razón Social</Label>
        <Input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="rfc">RFC</Label>
        <Input
          type="text"
          id="rfc"
          name="rfc"
          value={formData.rfc}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="regimenFiscal">Régimen Fiscal</Label>
        <Input
          type="text"
          id="regimenFiscal"
          name="regimenFiscal"
          value={formData.regimenFiscal}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="domicilioFiscal">Domicilio Fiscal</Label>
        <Input
          type="text"
          id="domicilioFiscal"
          name="domicilioFiscal"
          value={formData.domicilioFiscal}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="fechaConstitucion">Fecha de Constitución</Label>
        <Input
          type="date"
          id="fechaConstitucion"
          name="fechaConstitucion"
          value={formData.fechaConstitucion}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default MoralPersonForm;
