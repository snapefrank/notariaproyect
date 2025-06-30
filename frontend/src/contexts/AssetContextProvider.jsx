// ...importaciones iguales...
import React, { useState, useEffect, useCallback } from 'react';
import AssetContext from '@/contexts/AssetContext';
import { useToast } from '@/components/ui/use-toast';
import {
  initializePropertiesData,
  initializeArtworksData,
  initializeOtherAssetsData
} from '@/contexts/assetData';
import axios from 'axios';

export const AssetProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [otherAssets, setOtherAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = 'http://localhost:5000/api/properties';

  const initializeProperties = useCallback(() => {
    const data = initializePropertiesData();
    setProperties(data);
    localStorage.setItem('notaria_properties', JSON.stringify(data));
  }, []);

  const initializeArtworks = useCallback(() => {
    const data = initializeArtworksData();
    setArtworks(data);
    localStorage.setItem('notaria_artworks', JSON.stringify(data));
  }, []);

  const initializeOtherAssets = useCallback(() => {
    const data = initializeOtherAssetsData();
    setOtherAssets(data);
    localStorage.setItem('notaria_other_assets', JSON.stringify(data));
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await axios.get(API_URL);
        const loadedProperties = response.data;
        setProperties(loadedProperties);
        localStorage.setItem('notaria_properties', JSON.stringify(loadedProperties));
      } catch (error) {
        console.error('Error loading properties from backend:', error);
        initializeProperties();
      }

      try {
        const storedArtworks = localStorage.getItem('notaria_artworks');
        const storedOtherAssets = localStorage.getItem('notaria_other_assets');

        if (storedArtworks) setArtworks(JSON.parse(storedArtworks));
        else initializeArtworks();

        if (storedOtherAssets) setOtherAssets(JSON.parse(storedOtherAssets));
        else initializeOtherAssets();
      } catch (error) {
        console.error('Error loading other assets:', error);
        initializeArtworks();
        initializeOtherAssets();
      }

      setIsLoading(false);
    };

    loadAssets();
  }, [initializeProperties, initializeArtworks, initializeOtherAssets]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('notaria_properties', JSON.stringify(properties));
      localStorage.setItem('notaria_artworks', JSON.stringify(artworks));
      localStorage.setItem('notaria_other_assets', JSON.stringify(otherAssets));
    }
  }, [properties, artworks, otherAssets, isLoading]);

  // 🔧 Conversor universal a FormData (solo si hay archivos)
  const formatFormData = (data) => {
    const formData = new FormData();
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    }
    return formData;
  };

  const addProperty = async (newProperty) => {
    try {
      const isFormData = newProperty instanceof FormData;
      const dataToSend = isFormData ? newProperty : formatFormData(newProperty);

      const response = await axios.post(API_URL, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const savedProperty = response.data;
      setProperties((prev) => [...prev, savedProperty]);

      toast({
        title: 'Propiedad agregada',
        description: 'La propiedad fue guardada exitosamente en la base de datos.',
      });

      return savedProperty;
    } catch (error) {
      console.error('Error al agregar propiedad:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la propiedad en el backend.',
        variant: 'destructive',
      });
    }
  };

  const updateProperty = async (id, updatedData) => {
    try {
      const isFormData = updatedData instanceof FormData;
      const dataToSend = isFormData ? updatedData : formatFormData(updatedData);

      const response = await axios.put(`${API_URL}/${id}`, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = response.data;
      setProperties((prev) => prev.map((p) => (p._id === id ? updated : p)));

      toast({
        title: 'Propiedad actualizada',
        description: 'La propiedad fue modificada exitosamente.',
      });
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la propiedad.',
        variant: 'destructive',
      });
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast({
        title: 'Propiedad eliminada',
        description: 'La propiedad fue eliminada exitosamente.',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad.',
        variant: 'destructive',
      });
    }
  };

  // Otros activos
  const createAssetUpdater = (setter, assetName) => (id, updatedData) => {
    setter((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === id ? { ...asset, ...updatedData } : asset
      )
    );
    toast({
      title: `${assetName} actualizado(a)`,
      description: `El/La ${assetName.toLowerCase()} ha sido actualizado(a) exitosamente`,
    });
  };

  const createAssetDeleter = (setter, assetName) => (id) => {
    setter((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
    toast({
      title: `${assetName} eliminado(a)`,
      description: `El/La ${assetName.toLowerCase()} ha sido eliminado(a) exitosamente`,
      variant: 'destructive',
    });
  };

  const createAssetAdder = (setter, assetName) => (newAssetData) => {
    const assetToAdd = {
      ...newAssetData,
      id: Date.now().toString(),
      documents: []
    };
    setter((prevAssets) => [...prevAssets, assetToAdd]);
    toast({
      title: `${assetName} agregado(a)`,
      description: `El/La ${assetName.toLowerCase()} ha sido agregado(a) exitosamente`,
    });
    return assetToAdd;
  };

  const addArtwork = createAssetAdder(setArtworks, 'Obra de Arte');
  const updateArtwork = createAssetUpdater(setArtworks, 'Obra de Arte');
  const deleteArtwork = createAssetDeleter(setArtworks, 'Obra de Arte');

  const addOtherAsset = createAssetAdder(setOtherAssets, 'Activo');
  const updateOtherAsset = createAssetUpdater(setOtherAssets, 'Activo');
  const deleteOtherAsset = createAssetDeleter(setOtherAssets, 'Activo');

  const getPropertyById = (id) =>
    properties.find((p) => p.id === id || p._id === id); // compatibilidad

  const getArtworkById = (id) => artworks.find((a) => a.id === id);
  const getOtherAssetById = (id) => otherAssets.find((o) => o.id === id);

  const value = {
    properties, artworks, otherAssets, isLoading,
    addProperty, updateProperty, deleteProperty, getPropertyById,
    addArtwork, updateArtwork, deleteArtwork, getArtworkById,
    addOtherAsset, updateOtherAsset, deleteOtherAsset, getOtherAssetById
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
