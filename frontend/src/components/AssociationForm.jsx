import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AssociationForm = ({ onSubmit, onCancel }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-6 max-h-[80vh] overflow-y-auto"
    >
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
          <Label htmlFor="apoderadoLegal">Apoderado legal</Label>
          <Input
            type="text"
            id="apoderadoLegal"
            name="apoderadoLegal"
            value={formData.apoderadoLegal}
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
        <div>
          <Label htmlFor="deedFile">Escritura (PDF)</Label>
          <Input
            type="file"
            id="deedFile"
            name="deedFile"
            accept=".pdf"
            onChange={(e) => setDeedFile(e.target.files[0])}
          />
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
        </div>
        <div>
          <Label htmlFor="additionalFiles">Documentos adicionales</Label>
          <Input
            type="file"
            id="additionalFiles"
            name="additionalFiles"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setAdditionalFiles(Array.from(e.target.files))}
          />
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
