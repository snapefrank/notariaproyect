import React from 'react';
import { Link } from 'react-router-dom';
import { Building, PaintBucket, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const getAssetIcon = (type) => {
  switch (type) {
    case 'property': return <Building className="h-5 w-5 text-blue-600" />;
    case 'artwork': return <PaintBucket className="h-5 w-5 text-purple-600" />;
    case 'other': return <Package className="h-5 w-5 text-amber-600" />;
    default: return <Package className="h-5 w-5 text-gray-600" />;
  }
};

const getAssetName = (asset, type) => {
  if (!asset) return 'No disponible';
  return asset.name || asset.title || 'No disponible';
};

const getAssetTypeLabel = (type) => {
  switch (type) {
    case 'property': return 'Inmueble';
    case 'artwork': return 'Obra de Arte';
    case 'other': return 'Otro Activo';
    default: return 'Activo';
  }
};

const getAssetLinkPath = (type) => {
  switch (type) {
    case 'property': return '/properties';
    case 'artwork': return '/artworks';
    case 'other': return '/other-assets';
    default: return '/';
  }
};

const RelatedAssetInfo = ({ document, relatedAsset }) => {
  if (!document) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activo Relacionado</CardTitle>
        <CardDescription>Información sobre el activo vinculado a este documento</CardDescription>
      </CardHeader>
      <CardContent>
        {relatedAsset ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                {getAssetIcon(document.type)}
              </div>
              <div>
                <h3 className="font-medium">{getAssetName(relatedAsset, document.type)}</h3>
                <p className="text-sm text-muted-foreground">{getAssetTypeLabel(document.type)}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md space-y-2">
              {document.type === 'property' && relatedAsset.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">{relatedAsset.address}</p>
                </div>
              )}
              {document.type === 'property' && relatedAsset.type && (
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium text-capitalize">
                    {relatedAsset.type === 'residential' ? 'Residencial' : 
                     relatedAsset.type === 'commercial' ? 'Comercial' : 
                     relatedAsset.type === 'industrial' ? 'Industrial' : 'Terreno'}
                  </p>
                </div>
              )}
              
              {document.type === 'artwork' && relatedAsset.artist && (
                <div>
                  <p className="text-sm text-muted-foreground">Artista</p>
                  <p className="font-medium">{relatedAsset.artist}</p>
                </div>
              )}
              {document.type === 'artwork' && relatedAsset.year && (
                <div>
                  <p className="text-sm text-muted-foreground">Año</p>
                  <p className="font-medium">{relatedAsset.year}</p>
                </div>
              )}
              
              {document.type === 'other' && relatedAsset.type && (
                <div>
                  <p className="text-sm text-muted-foreground">Tipo Específico</p>
                  <p className="font-medium text-capitalize">
                    {relatedAsset.type === 'collection' ? 'Colección' : 
                     relatedAsset.type === 'vehicle' ? 'Vehículo' : 
                     relatedAsset.type === 'jewelry' ? 'Joyería' : 
                     relatedAsset.type === 'furniture' ? 'Mobiliario' : 'Otro'}
                  </p>
                </div>
              )}
              {document.type === 'other' && relatedAsset.location && (
                 <div>
                   <p className="text-sm text-muted-foreground">Ubicación</p>
                   <p className="font-medium">{relatedAsset.location}</p>
                 </div>
              )}

              {relatedAsset.value && (
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">${Number(relatedAsset.value).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              {getAssetIcon(document.type)}
            </div>
            <h3 className="font-medium">No hay activo relacionado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Este documento no está vinculado a ningún activo específico.
            </p>
          </div>
        )}
      </CardContent>
      {relatedAsset && (
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to={getAssetLinkPath(document.type)}>
              Ver todos los {getAssetTypeLabel(document.type).toLowerCase()}s
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RelatedAssetInfo;