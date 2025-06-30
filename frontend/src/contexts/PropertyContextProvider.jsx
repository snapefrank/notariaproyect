import React, { useState, useEffect } from 'react';
import AssetContext from '@/contexts/AssetContext';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export const AssetProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = 'http://localhost:5000/api/properties';

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await axios.get(API_URL);
        setProperties(response.data);
      } catch (error) {
        console.error('Error al cargar inmuebles:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los inmuebles.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const addProperty = async (newProperty) => {
    try {
      const response = await axios.post(API_URL, newProperty);
      setProperties(prev => [...prev, response.data]);

      toast({
        title: 'Inmueble creado',
        description: 'El inmueble ha sido creado exitosamente',
      });

      return response.data;
    } catch (error) {
      console.error('Error al crear inmueble:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el inmueble.',
        variant: 'destructive',
      });
    }
  };

  const updateProperty = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setProperties(prev =>
        prev.map(prop => (prop.id === id ? response.data : prop))
      );

      toast({
        title: 'Inmueble actualizado',
        description: 'Los datos del inmueble se actualizaron correctamente',
      });

      return response.data;
    } catch (error) {
      console.error('Error al actualizar inmueble:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el inmueble.',
        variant: 'destructive',
      });
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProperties(prev => prev.filter(prop => prop.id !== id));

      toast({
        title: 'Inmueble eliminado',
        description: 'El inmueble se eliminó correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar inmueble:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el inmueble.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AssetContext.Provider
      value={{
        properties,
        isLoading,
        addProperty,
        updateProperty,
        deleteProperty,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
