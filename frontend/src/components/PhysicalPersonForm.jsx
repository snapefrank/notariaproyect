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
    datosMedicos: [{
      tipoSangre: '',
      aseguradora: '',
      tipoSeguro: '',
      beneficiarios: '',
      fechaInicioVigencia: '',
      fechaVencimiento: '',
      numeroPoliza: '',
      prima: '',
    }],
    creditos: [{
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
    }],
    creditoDocumentos: []

  });

  const [docFiles, setDocFiles] = useState({
    rfcFile: null,
    curpFile: null,
    nssFile: null
  });
  const [insuranceFile, setInsuranceFile] = useState([]);
  const [creditFiles, setCreditFiles] = useState([]);
  // [{ file: File, nombre: string }]
  const [additionalPersonalDocs, setAdditionalPersonalDocs] = useState([]);
  const [tieneSeguro, setTieneSeguro] = useState(false);
  const [tieneCredito, setTieneCredito] = useState(false);
  const [sexoError, setSexoError] = useState(false);


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
        fechaNacimiento: formatDateToInput(initialData.fechaNacimiento),
        datosMedicos: Array.isArray(initialData.datosMedicos)
          ? initialData.datosMedicos
          : [{
            tipoSangre: '',
            aseguradora: '',
            tipoSeguro: '',
            beneficiarios: '',
            fechaInicioVigencia: '',
            fechaVencimiento: '',
            numeroPoliza: '',
            prima: ''
          }],
        creditos: Array.isArray(initialData.creditos)
          ? initialData.creditos
          : [{
            institucionFinanciera: '',
            montoCredito: '',
            plazoMeses: '',
            tasaInteresAnual: '',
            pagoMensual: '',
            tieneInmuebleGarantia: false,
            tipoInmueble: '',
            direccionInmueble: '',
            valorComercial: '',
            observaciones: ''
          }]
      });

      setTieneSeguro(!!initialData.datosMedicos?.length);
      setTieneCredito(!!initialData.creditos?.length);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith('datosMedicos.')) {
      const [, index, field] = name.split('.');
      const updated = [...formData.datosMedicos];
      updated[Number(index)][field] = value;
      setFormData((prev) => ({ ...prev, datosMedicos: updated }));
    }

    else if (name.startsWith('creditos.')) {
      const [, index, field] = name.split('.');
      const updated = [...formData.creditos];
      updated[Number(index)][field] = type === 'checkbox' ? checked : value;
      setFormData((prev) => ({ ...prev, creditos: updated }));
    }

    else if (['escritura', 'adicional'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        documentos: { ...prev.documentos, [name]: files[0] }
      }));
    }

    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sexo || formData.sexo.trim() === '') {
      setSexoError(true);
      return;
    } else {
      setSexoError(false);
    }
    const data = new FormData();

    // Campos simples y objetos anidados
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'datosMedicos') {
        value.forEach((seguro, index) => {
          Object.entries(seguro).forEach(([subKey, subValue]) => {
            const val = typeof subValue === 'boolean' ? String(subValue) : subValue;
            data.append(`datosMedicos[${index}][${subKey}]`, val ?? '');
          });
        });
      } else if (key === 'creditos') {
        data.append('creditos', JSON.stringify(value));
      }
      else if (key === 'documentos') {
        Object.entries(value).forEach(([docKey, file]) => {
          if (file) {
            data.append(docKey, file); // 'escritura', 'adicional'
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
    insuranceFile.forEach((fileList, index) => {
      if (Array.isArray(fileList)) {
        fileList.forEach((file, i) => {
          if (file) {
            data.append(`insuranceFile_${index}_${i}`, file);
          }
        });
      }
    });
    creditFiles.forEach((fileList, index) => {
      if (Array.isArray(fileList)) {
        fileList.forEach((file, i) => {
          if (file) {
            data.append(`creditFile_${index}_${i}`, file);
          }
        });
      }
    });
    // Documentos adicionales con NOMBRE editable
    if (additionalPersonalDocs.length > 0) {
      additionalPersonalDocs.forEach((doc) => {
        if (doc?.file) {
          // archivo
          data.append('additionalDocs', doc.file);
          // nombre amigable (si viene vacío, el backend usará originalname como fallback)
          if (doc.nombre && doc.nombre.trim() !== '') {
            data.append('documentosAdicionalesNombres[]', doc.nombre.trim());
          } else {
            data.append('documentosAdicionalesNombres[]', '');
          }
        }
      });
    }





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
            <Input id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
            <Input id="apellidoPaterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
            <Input id="apellidoMaterno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
            <Input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="rfc">RFC</Label>
            <Input id="rfc" name="rfc" value={formData.rfc} onChange={handleChange} />
            <Input type="file" name="rfcFile" accept=".pdf,.jpg,.png" onChange={handleDocFileChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="curp">CURP</Label>
            <Input id="curp" name="curp" value={formData.curp} onChange={handleChange} />
            <Input type="file" name="curpFile" accept=".pdf,.jpg,.png" onChange={handleDocFileChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="nss">NSS</Label>
            <Input id="nss" name="nss" value={formData.nss} onChange={handleChange} />
            <Input type="file" name="nssFile" accept=".pdf,.jpg,.png" onChange={handleDocFileChange} className="mt-1" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="additionalDocs">Documentos personales adicionales</Label>
            <Input
              type="file"
              id="additionalDocs"
              name="additionalDocs"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                // Creamos objetos {file, nombre: ''} por cada archivo nuevo
                const mapped = files.map((f) => ({ file: f, nombre: '' }));
                setAdditionalPersonalDocs(mapped);
              }}
            />

            {/* UI para capturar el nombre de cada archivo seleccionado */}
            {additionalPersonalDocs.length > 0 && (
              <div className="mt-3 space-y-3">
                {additionalPersonalDocs.map((doc, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <div className="text-sm text-gray-600 truncate">
                      {/* Vista del nombre del archivo físico */}
                      Archivo: <span className="font-medium">{doc.file?.name}</span>
                    </div>
                    <div>
                      <Label className="text-sm">¿Cómo deseas nombrar este documento?</Label>
                      <Input
                        placeholder="Ej. INE por ambos lados"
                        value={doc.nombre}
                        onChange={(e) => {
                          const updated = [...additionalPersonalDocs];
                          updated[idx].nombre = e.target.value;
                          setAdditionalPersonalDocs(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="sexo">Sexo</Label>
            <Select
              value={formData.sexo}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, sexo: value }));
                setSexoError(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
              </SelectContent>
            </Select>
            {sexoError && (
              <p className="text-sm text-red-500 mt-1">Por favor selecciona el sexo.</p>
            )}
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

            {formData.datosMedicos.map((seguro, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded p-3 mb-4">
                {Object.entries(seguro)
                  .filter(([key]) => key !== '_id' && key !== 'archivoSeguro') // 👈 oculta esos campos
                  .map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={`datosMedicos.${index}.${key}`}>
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
                        id={`datosMedicos.${index}.${key}`}
                        name={`datosMedicos.${index}.${key}`}
                        value={value}
                        onChange={(e) => {
                          const updated = [...formData.datosMedicos];
                          updated[index][key] = e.target.value;
                          setFormData(prev => ({ ...prev, datosMedicos: updated }));
                        }}
                      />
                    </div>
                  ))}
                  
                <div className="col-span-2">
                  <Label>Archivo del Seguro</Label>
                  <Input
                    type="file"
                    name={`insuranceFile_${index}`}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setInsuranceFile(prev => {
                        const updated = [...prev];
                        updated[index] = files;
                        return updated;
                      });
                    }}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  datosMedicos: [
                    ...prev.datosMedicos,
                    {
                      tipoSangre: '',
                      aseguradora: '',
                      tipoSeguro: '',
                      beneficiarios: '',
                      fechaInicioVigencia: '',
                      fechaVencimiento: '',
                      numeroPoliza: '',
                      prima: ''
                    }
                  ]
                }))
              }
            >
              Agregar Seguro
            </Button>
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
            <h3 className="text-lg font-medium text-gray-700 border-b pb-1">Crédito Financiero</h3>

            {formData.creditos.map((credito, index) => (
              <div key={index} className="border rounded p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`creditos.${index}.institucionFinanciera`}>Institución Financiera</Label>
                    <Input
                      name={`creditos.${index}.institucionFinanciera`}
                      value={credito.institucionFinanciera}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`creditos.${index}.montoCredito`}>Monto Total del Crédito</Label>
                    <Input
                      name={`creditos.${index}.montoCredito`}
                      value={credito.montoCredito}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`creditos.${index}.plazoMeses`}>Plazo (Meses)</Label>
                    <Input
                      type="number"
                      name={`creditos.${index}.plazoMeses`}
                      value={credito.plazoMeses}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`creditos.${index}.tasaInteresAnual`}>Tasa de Interés Anual (%)</Label>
                    <Input
                      type="number"
                      name={`creditos.${index}.tasaInteresAnual`}
                      value={credito.tasaInteresAnual}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`creditos.${index}.pagoMensual`}>Pago Mensual</Label>
                    <Input
                      type="number"
                      name={`creditos.${index}.pagoMensual`}
                      value={credito.pagoMensual}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>¿Tiene inmueble en garantía?</Label>
                    <Select
                      value={credito.tieneInmuebleGarantia ? 'yes' : 'no'}
                      onValueChange={(v) => {
                        const updated = [...formData.creditos];
                        updated[index].tieneInmuebleGarantia = v === 'yes';
                        setFormData((prev) => ({ ...prev, creditos: updated }));
                      }}
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
                        <Label htmlFor={`creditos.${index}.tipoInmueble`}>Tipo de Inmueble</Label>
                        <Input
                          name={`creditos.${index}.tipoInmueble`}
                          value={credito.tipoInmueble}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`creditos.${index}.direccionInmueble`}>Dirección del Inmueble</Label>
                        <Input
                          name={`creditos.${index}.direccionInmueble`}
                          value={credito.direccionInmueble}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`creditos.${index}.valorComercial`}>Valor Comercial</Label>
                        <Input
                          name={`creditos.${index}.valorComercial`}
                          value={credito.valorComercial}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-2">
                  <Label htmlFor={`creditos.${index}.observaciones`}>Observaciones</Label>
                  <textarea
                    className="w-full border rounded px-2 py-1 mt-1"
                    name={`creditos.${index}.observaciones`}
                    value={credito.observaciones}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 mt-2">
                  <Label>Subir Archivos del Crédito</Label>
                  <Input
                    type="file"
                    name={`creditFile_${index}`}
                    multiple
                    accept=".pdf"
                    onChange={(e) => {
                      const archivos = Array.from(e.target.files);
                      setCreditFiles((prev) => {
                        const updated = [...prev];
                        updated[index] = archivos;
                        return updated;
                      });
                    }}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
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
                      observaciones: ''
                    }
                  ]
                }))
              }
            >
              Agregar Crédito
            </Button>
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