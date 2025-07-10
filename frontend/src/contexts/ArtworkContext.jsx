import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ArtworkContext = createContext();
const API_URL = import.meta.env.VITE_API_URL + '/api/artworks';

export const useArtworks = () => useContext(ArtworkContext);

export const ArtworkProvider = ({ children }) => {
  const [artworks, setArtworks] = useState([]);

  const fetchArtworks = async () => {
    try {
      const response = await axios.get(API_URL);
      setArtworks(response.data);
    } catch (error) {
      console.error('Error al obtener las piezas de arte:', error);
    }
  };

  const addArtwork = async (newArtwork) => {
    try {
      const response = await axios.post(API_URL, newArtwork);
      setArtworks(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error al agregar la pieza de arte:', error);
    }
  };

  const updateArtwork = async (id, updatedArtwork) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedArtwork);
      setArtworks(prev =>
        prev.map(art => (art._id === id ? response.data : art))
      );
    } catch (error) {
      console.error('Error al actualizar la pieza de arte:', error);
    }
  };

  const deleteArtwork = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setArtworks(prev => prev.filter(artwork => artwork._id !== id));
    } catch (error) {
      console.error('Error al eliminar la pieza de arte:', error);
    }
  };

  const getArtworkById = (id) => artworks.find(art => art._id === id);

  useEffect(() => {
    fetchArtworks();
  }, []);

  return (
    <ArtworkContext.Provider
      value={{ artworks, addArtwork, updateArtwork, deleteArtwork, getArtworkById }}
    >
      {children}
    </ArtworkContext.Provider>
  );
};
