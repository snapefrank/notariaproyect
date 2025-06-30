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
    createdBy: user?.username || 'unknown'
  });
  
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData
      });
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
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
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
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ingrese una descripción del documento"
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
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
          
          <div className="space-y-2">
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
        </div>
        
        {formData.type === 'property' && (
          <div className="space-y-2">
            <Label htmlFor="propertyId">ID de Propiedad (opcional)</Label>
            <Input
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              placeholder="Ingrese el ID de la propiedad relacionada"
            />
          </div>
        )}
        
        {formData.type === 'artwork' && (
          <div className="space-y-2">
            <Label htmlFor="artworkId">ID de Obra de Arte (opcional)</Label>
            <Input
              id="artworkId"
              name="artworkId"
              value={formData.artworkId}
              onChange={handleChange}
              placeholder="Ingrese el ID de la obra de arte relacionada"
            />
          </div>
        )}
        
        {formData.type === 'other' && (
          <div className="space-y-2">
            <Label htmlFor="assetId">ID de Activo (opcional)</Label>
            <Input
              id="assetId"
              name="assetId"
              value={formData.assetId}
              onChange={handleChange}
              placeholder="Ingrese el ID del activo relacionado"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="tags">Etiquetas</Label>
          <div className="flex">
            <Input
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Agregar etiqueta"
              className="rounded-r-none"
            />
            <Button 
              type="button" 
              onClick={handleAddTag}
              className="rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
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