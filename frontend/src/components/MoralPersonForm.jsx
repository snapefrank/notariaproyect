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
    creditos: [
      {
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
        archivos: [] // Para los PDF por crédito
      }
    ],
    documentos: {
      rfcFile: null,
      additionalDocs: []
    }
  });
  const addCredito = () => {
    setFormData((prev) => ({
      ...prev,
      creditos: [
        ...prev.creditos,
        {
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
          archivos: []
        }
      ]
    }));
  };
  const removeCredito = (index) => {
    setFormData((prev) => {
      const nuevos = [...prev.creditos];
      nuevos.splice(index, 1);
      return { ...prev, creditos: nuevos };
    });
  };
  const updateCredito = (index, key, value) => {
    setFormData((prev) => {
      const creditos = [...prev.creditos];
      creditos[index][key] = value;
      return { ...prev, creditos };
    });
  };
  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => {
      const updatedCreditos = [...prev.creditos];
      updatedCreditos[index].archivos = files;
      return { ...prev, creditos: updatedCreditos };
    });
  };


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
    } else if (['escritura', 'adicional', 'rfcFile'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        documentos: { ...prev.documentos, [name]: files[0] }
      }));
    } else if (name === 'additionalDocs') {
      setFormData((prev) => ({
        ...prev,
        documentos: { ...prev.documentos, additionalDocs: Array.from(files) }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'creditos') {
        value.forEach((credito, index) => {
          Object.entries(credito).forEach(([subKey, subValue]) => {
            if (subKey === 'archivos') {
              subValue.forEach((archivo) => {
                data.append(`creditFile_${index}_${archivo.name}`, archivo);
              });
            } else {
              data.append(`creditos[${index}][${subKey}]`, subValue);
            }
          });
        });
      }
      else if (key === 'documentos') {
        Object.entries(value).forEach(([docKey, fileOrFiles]) => {
          if (!fileOrFiles) return;

          if (Array.isArray(fileOrFiles)) {
            fileOrFiles.forEach((f) => data.append(docKey, f));
          } else {
            data.append(docKey, fileOrFiles);
          }
        });
      }
      else {
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
            <Input
              type="file"
              name="rfcFile"
              accept="application/pdf"
              onChange={handleChange}
              className="mt-1"
            />
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
          <Input
            type="file"
            id="adicional"
            name="adicional"
            multiple
            accept="application/pdf"
            onChange={handleChange}
          />


        </div>

        {/* Créditos Financieros Múltiples */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Créditos Financieros</h3>

          {formData.creditos.map((credito, index) => (
            <div key={index} className="border p-4 mb-4 rounded-md space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Institución Financiera</Label>
                  <Input
                    value={credito.institucionFinanciera}
                    onChange={(e) => updateCredito(index, 'institucionFinanciera', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Monto del Crédito</Label>
                  <Input
                    value={credito.montoCredito}
                    onChange={(e) => updateCredito(index, 'montoCredito', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Plazo (Meses)</Label>
                  <Input
                    value={credito.plazoMeses}
                    onChange={(e) => updateCredito(index, 'plazoMeses', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tasa Interés Anual (%)</Label>
                  <Input
                    step="0.01"
                    value={credito.tasaInteresAnual}
                    onChange={(e) => updateCredito(index, 'tasaInteresAnual', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Pago Mensual</Label>
                  <Input
                    value={credito.pagoMensual}
                    onChange={(e) => updateCredito(index, 'pagoMensual', e.target.value)}
                  />
                </div>
                <div>
                  <Label>¿Tiene inmueble en garantía?</Label>
                  <Select
                    value={credito.tieneInmuebleGarantia ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      updateCredito(index, 'tieneInmuebleGarantia', value === 'yes')
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

                {credito.tieneInmuebleGarantia && (
                  <>
                    <div>
                      <Label>Tipo de Inmueble</Label>
                      <Input
                        value={credito.tipoInmueble}
                        onChange={(e) => updateCredito(index, 'tipoInmueble', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Dirección del Inmueble</Label>
                      <Input
                        value={credito.direccionInmueble}
                        onChange={(e) => updateCredito(index, 'direccionInmueble', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Valor Comercial</Label>
                      <Input
                        value={credito.valorComercial}
                        onChange={(e) => updateCredito(index, 'valorComercial', e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="col-span-full">
                  <Label>Observaciones</Label>
                  <textarea
                    value={credito.observaciones}
                    onChange={(e) => updateCredito(index, 'observaciones', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="col-span-full">
                  <Label>Documentos PDF</Label>
                  <Input
                    type="file"
                    name={`creditFile_${index}`}
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
              </div>
              {formData.creditos.length > 1 && (
                <Button type="button" variant="destructive" onClick={() => removeCredito(index)}>
                  Eliminar Crédito
                </Button>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addCredito}>
            Agregar Crédito
          </Button>
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
