import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ArtworkInformation = ({ artwork }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Obra de Arte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h3>
          <p className="text-base">{artwork.description || 'Sin descripción disponible.'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-muted-foreground">Artista</p>
              <p className="font-medium">{artwork.artist || 'Desconocido'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-muted-foreground">Año</p>
              <p className="font-medium">{artwork.year || 'Sin especificar'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-muted-foreground">Técnica</p>
              <p className="font-medium">{artwork.technique || 'No especificada'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">{artwork.status === 'active' ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>
        </div>

        {artwork.imageUrl && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Imagen</h3>
            <div className="p-4 border rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 text-primary mr-2" />
                <span>Imagen adjunta</span>
              </div>
              <a href={artwork.imageUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">Ver imagen</Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtworkInformation;
