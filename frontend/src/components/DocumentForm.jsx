import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const DocumentForm = ({ initialData, onSubmit, onCancel }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'property',
    category: 'legal',
    tags: [],
    fileUrl: null,
    propertyId: '',
    artworkId: '',
    assetId: '',
    clientId: '',
    status: 'activo', // ✅ agregar
    createdBy: user?.username || 'unknown',
    nombrePersonalizado: '',
  });

  const [file, setFile] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formToSend = { ...formData };
      delete formToSend.id;
      delete formToSend._id;

      if (file) {
        formToSend.file = file; // solo se agrega como propiedad para que el context lo maneje
      }

      onSubmit(formToSend); // el contexto se encarga de guardar
    } catch (error) {
      console.error('Error al procesar el documento:', error);
      alert('Error al procesar el documento');
    }
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

        {/* DATOS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título del Documento</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ingrese el título del documento"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ingrese una descripción"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de Activo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Inmueble</SelectItem>
                <SelectItem value="artwork">Obra de Arte</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
                <SelectItem value="certificate">Certificado</SelectItem>
                <SelectItem value="insurance">Seguro</SelectItem>
              </SelectContent>
            </Select>
          </div>


          {formData.type === 'artwork' && (
            <div className="md:col-span-2">
              <Label htmlFor="artworkId">ID de Obra de Arte (opcional)</Label>
              <Input
                id="artworkId"
                name="artworkId"
                value={formData.artworkId}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.type === 'other' && (
            <div className="md:col-span-2">
              <Label htmlFor="assetId">ID de Activo (opcional)</Label>
              <Input
                id="assetId"
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
              />
            </div>
          )}

          {/* ETIQUETAS */}
          <div className="md:col-span-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <div className="flex mb-2">
              <Input
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Agregar etiqueta"
                className="rounded-r-none"
              />
              <Button type="button" onClick={handleAddTag} className="rounded-l-none">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ARCHIVO */}
          <div className="md:col-span-2 space-y-2">
            <Label>Subir archivo</Label>
            <Input
              type="file"
              name="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setHasFile(e.target.files.length > 0);
              }}
            />
            {hasFile && (
              <div>
                <Label>¿Cómo deseas nombrar este documento?</Label>
                <Input
                  placeholder="Ej. Certificado de autenticidad"
                  value={formData.nombrePersonalizado || ''}
                  onChange={(e) => handleChange({ target: { name: 'nombrePersonalizado', value: e.target.value } })}
                />
              </div>
            )}
          </div>

        </div>

        {/* BOTONES */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? 'Actualizar' : 'Crear'} Documento
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default DocumentForm;
