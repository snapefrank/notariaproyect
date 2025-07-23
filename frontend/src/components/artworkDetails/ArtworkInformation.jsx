import React, { useState } from 'react';
import { ImageIcon, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiBase } from '@/lib/constants';

const ArtworkInformation = ({ artwork, ownerName }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const formatCurrency = (value) => {
    if (!value) return 'No especificado';
    return `$${Number(value).toLocaleString('es-MX')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Obra de Arte</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        {/* Descripción */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h3>
          <p className="text-base">{artwork.description || 'Sin descripción disponible.'}</p>
        </div>

        {/* Información general */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Propietario" value={ownerName || artwork.ownerExternalName || 'Propietario no especificado'} />
            <Info label="Artista" value={artwork.artist} />
            <Info label="Año" value={artwork.year} />
            <Info label="Técnica" value={artwork.technique} />
            <Info label="Tipo de Obra" value={artwork.type} />
            <Info label="Medidas" value={artwork.dimensions} />
            <Info label="Ubicación" value={artwork.location} />
            <Info label="Valor" value={formatCurrency(artwork.value)} />
            <Info label="Fecha de Adquisición" value={formatDate(artwork.acquisitionDate)} />
          </div>
        </div>

        {/* Documento certificado */}
        {artwork.certificatePath && (
          <div className="pt-6 border-t space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Certificado</h3>
            <div className="p-4 border rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <span>Archivo PDF del certificado</span>
              </div>
              <a
                href={`${apiBase}/${artwork.certificatePath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">Ver documento</Button>
              </a>
            </div>
          </div>
        )}

        {/* Galería de fotos */}
        {artwork.photoPaths?.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-base font-semibold mb-2">Fotos de la Obra</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {artwork.photoPaths.map((path, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(`${apiBase}/uploads/artworks/photos/${path.split('/').pop()}`)}
                  className="focus:outline-none"
                >
                  {failedImages[index] ? (
                    <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center rounded-md">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">Imagen no disponible</span>
                    </div>
                  ) : (
                    <img
                      src={`${apiBase}/uploads/artworks/photos/${path.split('/').pop()}`}
                      alt={`Foto ${index + 1}`}
                      className="rounded-md w-full h-32 object-cover shadow-sm hover:ring-2 hover:ring-blue-500"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ampliar imagen */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="max-w-full max-h-full rounded shadow-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Info = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-md">
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="font-medium">{value || 'No especificado'}</p>
  </div>
);

export default ArtworkInformation;
