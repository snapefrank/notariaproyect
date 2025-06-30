import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const PhysicalPersonForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    rfc: '',
    curp: '',
    nss: '',
    direccion: '',
    sexo: '',
    datosMedicos: {
      tipoSangre: '',
      aseguradora: '',
      tipoSeguro: '',
      beneficiarios: '',
      fechaInicioVigencia: '',
      fechaVencimiento: '',
      numeroPoliza: '',
      prima: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        datosMedicos: {
          ...formData.datosMedicos,
          ...initialData.datosMedicos
        }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('datosMedicos.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        datosMedicos: { ...prev.datosMedicos, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Crear Nueva Persona Física</h2>
            <p className="text-sm text-gray-500">Complete el formulario para registrar una nueva persona física en el sistema.</p>
          </div>

          {/* Sección: Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-1">Información Personal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
                <Input id="apellidoPaterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                <Input id="apellidoMaterno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="rfc">RFC</Label>
                <Input id="rfc" name="rfc" value={formData.rfc} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="curp">CURP</Label>
                <Input id="curp" name="curp" value={formData.curp} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="nss">NSS</Label>
                <Input id="nss" name="nss" value={formData.nss} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} required className="w-full border rounded px-2 py-1">
                  <option value="">Selecciona</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Datos Médicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-1">Datos Médicos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData.datosMedicos).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={`datosMedicos.${key}`}>
                    {{
                      tipoSangre: 'Tipo de Sangre',
                      aseguradora: 'Aseguradora',
                      tipoSeguro: 'Tipo de Seguro',
                      beneficiarios: 'Beneficiarios',
                      fechaInicioVigencia: 'Inicio de Vigencia',
                      fechaVencimiento: 'Vencimiento',
                      numeroPoliza: 'Número de Póliza',
                      prima: 'Prima'
                    }[key] || key}
                  </Label>
                  <Input
                    type={key.includes('fecha') ? 'date' : 'text'}
                    id={`datosMedicos.${key}`}
                    name={`datosMedicos.${key}`}
                    value={value}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhysicalPersonForm;
