import React, { useState, useEffect } from 'react';
import { useArtworks } from '@/contexts/ArtworkContext';

const ArtworkForm = ({ onCancel, initialData = {} }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const { addArtwork, updateArtwork } = useArtworks();

  // Llenar formulario si se edita
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setArtist(initialData.artist || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { title, artist };

    if (initialData._id) {
      await updateArtwork(initialData._id, formData); // editar
    } else {
      await addArtwork(formData); // crear
    }

    onCancel(); // cerrar formulario
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Artista</label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="btn btn-primary">
          {initialData._id ? 'Actualizar' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  );
};

export default ArtworkForm;
