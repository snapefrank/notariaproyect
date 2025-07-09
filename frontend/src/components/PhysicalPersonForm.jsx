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

const formatDateToInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

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

  const [docFiles, setDocFiles] = useState({
    rfcFile: null,
    curpFile: null,
    nssFile: null
  });

  const [tieneSeguro, setTieneSeguro] = useState(false);
  const [tieneCredito, setTieneCredito] = useState(false);

  const handleDocFileChange = (e) => {
    const { name, files } = e.target;

    if (['rfcFile', 'curpFile', 'nssFile'].includes(name)) {
      setDocFiles((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        documentos: { ...prev.documentos, [name]: files[0] }
      }));
    }
  };


  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        fechaNacimiento: formatDateToInput(initialData.fechaNacimiento), // 👈 CORREGIDO
        datosMedicos: {
          ...formData.datosMedicos,
          ...initialData.datosMedicos
        }
      });

      setTieneSeguro(!!initialData.datosMedicos?.aseguradora);
      setTieneCredito(!!initialData.credito?.institucionFinanciera);
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith('datosMedicos.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        datosMedicos: { ...prev.datosMedicos, [key]: value },
      }));
    } else if (name.startsWith('credito.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        credito: { ...prev.credito, [key]: type === 'checkbox' ? checked : value },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Campos simples y objetos anidados
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'datosMedicos' || key === 'credito') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const val = typeof subValue === 'boolean' ? String(subValue) : subValue;
          data.append(`${key}.${subKey}`, val ?? '');
        });
      } else if (key === 'documentos') {
        Object.entries(value).forEach(([docKey, file]) => {
          if (file) {
            data.append(docKey, file); // usa directamente 'escritura' y 'adicional'
          }
        });
      } else {
        const val = typeof value === 'boolean' ? String(value) : value;
        data.append(key, val ?? '');
      }
    });


    // Agrega los archivos RFC/CURP/NSS directamente
    if (docFiles.rfcFile) data.append('rfcFile', docFiles.rfcFile);
    if (docFiles.curpFile) data.append('curpFile', docFiles.curpFile);
    if (docFiles.nssFile) data.append('nssFile', docFiles.nssFile);

    // 🚫 YA NO guardes directamente con fetch
    // ✅ ENVÍA LOS DATOS AL CONTEXTO A TRAVÉS DE onSubmit

    console.log('📦 Contenido que se enviará al backend:');
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }



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
            <Input type="file" name="rfcFile" accept=".pdf,.jpg,.png" onChange={handleDocFileChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="curp">CURP</Label>
            <Input id="curp" name="curp" value={formData.curp} onChange={handleChange} required />
            <Input type="file" name="curpFile" accept=".pdf,.jpg,.png" onChange={handleDocFileChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="nss">NSS</Label>
            <Input id="nss" name="nss" value={formData.nss} onChange={handleChange} required />
            <Input type="file" name="nssFile" accept=".pdf,.jpg,.png" onChange={handleDocFileChange} className="mt-1" />
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 border-b pb-1">¿Tiene Seguro?</h3>
          <Select
            value={tieneSeguro ? 'yes' : 'no'}
            onValueChange={(value) => setTieneSeguro(value === 'yes')}
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
        {tieneSeguro && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-1">Datos del Seguro</h3>
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
        )}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 border-b pb-1">¿Tiene Crédito Financiero?</h3>
          <Select
            value={tieneCredito ? 'yes' : 'no'}
            onValueChange={(value) => setTieneCredito(value === 'yes')}
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
        {tieneCredito && (
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-1">Crédito Financiero</h3>
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


                {/* Datos del Inmueble */}
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
                      <Input type="file" id="escritura" name="escritura" accept="application/pdf" onChange={handleDocFileChange} />
                    </div>
                    <div>
                      <Label htmlFor="adicional">Subir Documento Adicional (PDF)</Label>
                      <Input type="file" id="adicional" name="adicional" accept="application/pdf" onChange={handleDocFileChange} />
                    </div>
                  </>
                )}


                <div className="col-span-full">
                  <Label htmlFor="credito.observaciones">Observaciones</Label>
                  <textarea id="credito.observaciones" name="credito.observaciones" value={formData.credito.observaciones} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </motion.div >
  );
};
export default PhysicalPersonForm;
