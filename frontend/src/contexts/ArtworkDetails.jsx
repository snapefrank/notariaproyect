import React from 'react';
import { useParams } from 'react-router-dom';
import { useArtworks } from '@/contexts/ArtworkContext';

const ArtworkDetails = () => {
  const { id } = useParams();
  const { artworks } = useArtworks();
  const artwork = artworks.find(a => a._id === id);


  if (!artwork) {
    return <p>Obra de arte no encontrada</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{artwork.title}</h1>
      <p className="text-muted-foreground mt-2">Artista: {artwork.artist}</p>
      {/* Aquí puedes agregar más detalles específicos de la obra de arte */}
    </div>
  );
};

export default ArtworkDetails;