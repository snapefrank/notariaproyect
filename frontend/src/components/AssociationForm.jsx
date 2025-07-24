import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AssociationForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apoderadoLegal: '',
    numeroEscritura: '',
    fechaEscritura: '',
    regimenFiscal: '',
    rfc: '',
  });

  const [deedFile, setDeedFile] = useState(null);
  const [rfcFile, setRfcFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [existingAdditionalFiles, setExistingAdditionalFiles] = useState([]);

  useEffect(() => {
    // Solo actualiza si existe initialData y tiene al menos un campo clave
    if (initialData && initialData.nombre) {
      setFormData({
        nombre: initialData.nombre || '',
        apoderadoLegal: initialData.apoderadoLegal || '',
        numeroEscritura: initialData.numeroEscritura || '',
        fechaEscritura: initialData.fechaEscritura
          ? initialData.fechaEscritura.slice(0, 10)
          : '',
        regimenFiscal: initialData.regimenFiscal || '',
        rfc: initialData.rfc || '',
      });

      if (Array.isArray(initialData.additionalFiles)) {
        setExistingAdditionalFiles(initialData.additionalFiles);
      }
    }
  }, [initialData?.nombre]); // ✅ Dependencia controlada: evita re-render infinito


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (deedFile) data.append('deedFile', deedFile);
    if (rfcFile) data.append('rfcFile', rfcFile);
    if (additionalFiles.length > 0) {
      additionalFiles.forEach(file => data.append('additionalFiles', file));
    }

    onSubmit(data);
  };

  const handleAddAdditionalFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setAdditionalFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveExistingFile = (index) => {
    const updated = [...existingAdditionalFiles];
    updated.splice(index, 1);
    setExistingAdditionalFiles(updated);
    // ⚠️ OJO: si quieres eliminar del servidor también, necesitas enviar esa info al backend.
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-6 max-h-[80vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'nombre', label: 'Nombre de la asociación' },
          { name: 'apoderadoLegal', label: 'Apoderado legal' },
          { name: 'numeroEscritura', label: 'Número de escritura' },
          { name: 'fechaEscritura', label: 'Fecha de escritura', type: 'date' },
          { name: 'regimenFiscal', label: 'Régimen fiscal' },
          { name: 'rfc', label: 'RFC' },
        ].map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div>
          <Label htmlFor="deedFile">Escritura (PDF)</Label>
          <Input
            type="file"
            id="deedFile"
            name="deedFile"
            accept=".pdf"
            onChange={(e) => setDeedFile(e.target.files[0])}
          />
          {initialData.deedFile && (
            <p className="text-sm text-gray-500 mt-1">
              Archivo actual:{' '}
              <a
                href={`${import.meta.env.VITE_API_URL}/${initialData.deedFile}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Ver escritura
              </a>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="rfcFile">Archivo RFC (PDF)</Label>
          <Input
            type="file"
            id="rfcFile"
            name="rfcFile"
            accept=".pdf"
            onChange={(e) => setRfcFile(e.target.files[0])}
          />
          {initialData.rfcFile && (
            <p className="text-sm text-gray-500 mt-1">
              Archivo actual:{' '}
              <a
                href={`${import.meta.env.VITE_API_URL}/${initialData.rfcFile}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Ver RFC
              </a>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="additionalFiles">Documentos adicionales</Label>
          <Input
            type="file"
            id="additionalFiles"
            name="additionalFiles"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleAddAdditionalFiles}
          />

          {/* Mostrar archivos existentes */}
          {existingAdditionalFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {existingAdditionalFiles.map((fileUrl, index) => (
                <li key={index} className="flex justify-between items-center">
                  <a
                    href={`${import.meta.env.VITE_API_URL}/${fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Documento {index + 1}
                  </a>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveExistingFile(index)}
                  >
                    ❌
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssociationForm;
