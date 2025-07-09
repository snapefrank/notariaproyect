import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { motion } from 'framer-motion';

const MoralPersonForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    regimenFiscal: '',
    domicilioFiscal: '',
    fechaConstitucion: '',
    credito: {
      institucionFinanciera: '',
      montoCredito: '',
      plazoMeses: '',
      tasaInteresAnual: '',
      pagoMensual: '',
      tieneInmuebleGarantia: false,
      tipoInmueble: '',
      direccionInmueble: '',
      valorComercial: '',
      observaciones: '',
    },
    documentos: {
      escritura: null,
      adicional: null,
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        credito: {
          ...prev.credito,
          ...initialData.credito
        }
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith('credito.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        credito: {
          ...prev.credito,
          [key]: type === 'checkbox' ? checked : value,
        }
      }));
    } else if (['escritura', 'adicional'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        documentos: { ...prev.documentos, [name]: files[0] }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'credito') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          data.append(`credito.${subKey}`, subValue);
        });
      } else if (key === 'documentos') {
        Object.entries(value).forEach(([docKey, file]) => {
          if (file) data.append(docKey, file);
        });
      } else {
        data.append(key, value);
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
          {/* Información básica */}
          <div>
            <Label htmlFor="nombre">Nombre o Razón Social</Label>
            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="rfc">RFC</Label>
            <Input id="rfc" name="rfc" value={formData.rfc} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="regimenFiscal">Régimen Fiscal</Label>
            <Input id="regimenFiscal" name="regimenFiscal" value={formData.regimenFiscal} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="domicilioFiscal">Domicilio Fiscal</Label>
            <Input id="domicilioFiscal" name="domicilioFiscal" value={formData.domicilioFiscal} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="fechaConstitucion">Fecha de Constitución</Label>
            <Input type="date" id="fechaConstitucion" name="fechaConstitucion" value={formData.fechaConstitucion} onChange={handleChange} required />
          </div>
        </div>
        {/* Crédito Financiero */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Crédito Financiero</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="credito.institucionFinanciera">Institución Financiera</Label>
              <Input id="credito.institucionFinanciera" name="credito.institucionFinanciera" value={formData.credito.institucionFinanciera} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="credito.montoCredito">Monto Total del Crédito</Label>
              <Input type="number" id="credito.montoCredito" name="credito.montoCredito" value={formData.credito.montoCredito} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="credito.plazoMeses">Plazo (Meses)</Label>
              <Input type="number" id="credito.plazoMeses" name="credito.plazoMeses" value={formData.credito.plazoMeses} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="credito.tasaInteresAnual">Tasa de Interés Anual (%)</Label>
              <Input type="number" step="0.01" id="credito.tasaInteresAnual" name="credito.tasaInteresAnual" value={formData.credito.tasaInteresAnual} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="credito.pagoMensual">Pago Mensual</Label>
              <Input type="number" id="credito.pagoMensual" name="credito.pagoMensual" value={formData.credito.pagoMensual} onChange={handleChange} />
            </div>
            <div>
              <Label>¿Tiene inmueble en garantía?</Label>
              <Select
                value={formData.credito.tieneInmuebleGarantia ? 'yes' : 'no'}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    credito: {
                      ...prev.credito,
                      tieneInmuebleGarantia: value === 'yes'
                    }
                  }))
                }
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

            {formData.credito.tieneInmuebleGarantia && (
              <>
                <div>
                  <Label htmlFor="credito.tipoInmueble">Tipo de Inmueble</Label>
                  <Input id="credito.tipoInmueble" name="credito.tipoInmueble" value={formData.credito.tipoInmueble} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="credito.direccionInmueble">Dirección del Inmueble</Label>
                  <Input id="credito.direccionInmueble" name="credito.direccionInmueble" value={formData.credito.direccionInmueble} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="credito.valorComercial">Valor Estimado</Label>
                  <Input type="number" id="credito.valorComercial" name="credito.valorComercial" value={formData.credito.valorComercial} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="escritura">Subir Escritura (PDF)</Label>
                  <Input type="file" id="escritura" name="escritura" accept="application/pdf" onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="adicional">Subir Documento Adicional (PDF)</Label>
                  <Input type="file" id="adicional" name="adicional" accept="application/pdf" onChange={handleChange} />
                </div>
              </>
            )}
            <div className="col-span-full">
              <Label htmlFor="credito.observaciones">Observaciones</Label>
              <textarea id="credito.observaciones" name="credito.observaciones" value={formData.credito.observaciones} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
          </div>
        </div>
        {/* Botones */}
        <div className="flex justify-end space-x-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </motion.div>
  );
};
export default MoralPersonForm;
