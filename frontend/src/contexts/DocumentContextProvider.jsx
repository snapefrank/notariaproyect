import React, { useState, useEffect } from 'react';
import DocumentContext from '@/contexts/DocumentContext';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = 'http://localhost:5000/api/documents';

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await axios.get(API_URL);
        setDocuments(response.data);
      } catch (error) {
        console.error('Error al cargar documentos desde el backend:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los documentos del servidor.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const addDocument = async (newDocument) => {
    try {
      let responseData;

      // Elimina campos problemáticos antes de enviar
      const cleanedDoc = { ...newDocument };
      delete cleanedDoc.id;
      delete cleanedDoc._id;

      if (cleanedDoc.file) {
        const formData = new FormData();
        Object.entries(cleanedDoc).forEach(([key, value]) => {
          if (key === 'file') {
            formData.append('file', value);
          } else {
            formData.append(key, Array.isArray(value) ? value.join(',') : value);
          }
        });

        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Error al subir documento');
        }

        responseData = await res.json();
      } else {
        const res = await axios.post(API_URL, cleanedDoc);
        responseData = res.data;
      }

      setDocuments(prev => [...prev, responseData]);

      toast({
        title: 'Documento creado',
        description: 'El documento ha sido creado exitosamente',
      });

      return responseData;
    } catch (error) {
      console.error('Error al crear documento:', error.message);
      toast({
        title: 'Error',
        description: 'No se pudo crear el documento.',
        variant: 'destructive',
      });
    }
  };




  const updateDocument = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setDocuments(prev =>
        prev.map(doc => (doc._id === id ? response.data : doc))
      );

      toast({
        title: 'Documento actualizado',
        description: 'El documento ha sido actualizado exitosamente',
      });
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el documento.',
        variant: 'destructive',
      });
    }
  };

  const deleteDocument = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));

      toast({
        title: 'Documento eliminado',
        description: 'El documento ha sido eliminado exitosamente',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el documento.',
        variant: 'destructive',
      });
    }
  };

  const getDocumentById = (id) => documents.find(doc => doc._id === id);

  const getDocumentsByType = (type) => documents.filter(doc => doc.type === type);

  const getDocumentsByCategory = (category) => documents.filter(doc => doc.category === category);

  const searchDocuments = (query) => {
    const searchTerm = query.toLowerCase();
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.description.toLowerCase().includes(searchTerm) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  };

  const value = {
    documents,
    isLoading,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    getDocumentsByType,
    getDocumentsByCategory,
    searchDocuments
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
