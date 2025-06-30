import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AssociationForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apoderado: '',
    numeroEscritura: '',
    fechaEscritura: '',
    regimenFiscal: '',
    rfc: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre de la asociación</Label>
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
        <Label htmlFor="apoderado">Apoderado legal</Label>
        <Input
          type="text"
          id="apoderado"
          name="apoderado"
          value={formData.apoderado}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="numeroEscritura">Número de escritura</Label>
        <Input
          type="text"
          id="numeroEscritura"
          name="numeroEscritura"
          value={formData.numeroEscritura}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="fechaEscritura">Fecha de escritura</Label>
        <Input
          type="date"
          id="fechaEscritura"
          name="fechaEscritura"
          value={formData.fechaEscritura}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="regimenFiscal">Régimen fiscal</Label>
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
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default AssociationForm;
