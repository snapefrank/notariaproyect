import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Building, PaintBucket, Package, Calendar,
  DollarSign, MapPin, Edit, Trash, ImageIcon
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';

const AssetCard = ({ asset, assetType, onEdit, onDelete }) => {
  const location = useLocation();

  const getIcon = () => {
    switch (assetType) {
      case 'property': return <Building className="h-5 w-5" />;
      case 'artwork': return <PaintBucket className="h-5 w-5" />;
      case 'other': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (assetType) {
      case 'property': return asset.name;
      case 'artwork': return asset.title;
      case 'other': return asset.name;
      default: return '';
    }
  };

  const getSubtitle = () => {
    switch (assetType) {
      case 'property': return asset.address;
      case 'artwork': return `${asset.artist || 'Artista desconocido'}, ${asset.year || 'Año no especificado'}`;
      case 'other':
        return asset.type === 'collection' ? 'Colección' :
          asset.type === 'vehicle' ? 'Vehículo' :
            asset.type === 'jewelry' ? 'Joyería' :
              asset.type === 'furniture' ? 'Mobiliario' : 'Otro';
      default: return '';
    }
  };

  const getTypeLabel = () => {
    if (assetType === 'property') {
      switch (asset.type) {
        case 'residential': return 'Residencial';
        case 'commercial': return 'Comercial';
        case 'industrial': return 'Industrial';
        case 'land': return 'Terreno';
        default: return '';
      }
    }
    if (assetType === 'artwork') {
      return asset.type || 'Tipo no especificado';
    }
    return '';
  };

  const getLocation = () => {
    switch (assetType) {
      case 'property': return asset.address;
      case 'artwork':
      case 'other': return asset.location;
      default: return '';
    }
  };
  const getOwnerName = () => {
    if (asset.tipoPropietario === 'Personalizado') {
      return asset.owner || asset.propietario || 'Propietario personalizado';
    }

    const p = asset.propietario;
    if (p?.nombres) {
      return `${p.nombres} ${p.apellidoPaterno || ''} ${p.apellidoMaterno || ''}`.trim();
    }

    return p?.razonSocial || p?.nombre || 'Propietario no especificado';
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="document-card"
    >
      <Card className="h-full overflow-hidden border-t-4 shadow-md hover:shadow-lg transition-shadow">
<CardHeader className="pb-2">
  <div className="flex justify-between items-start">
    <div className="flex-1">
      {/* Badge de tipo (Residencial, Comercial, etc.) */}
      {(assetType === 'property' || assetType === 'artwork') && (
        <Badge variant="outline" className="mb-2">
          {getTypeLabel()}
        </Badge>
      )}

      {/* ✅ NUEVO: Badge de estado de alquiler SOLO si es propiedad */}
      {assetType === 'property' && (
        asset.isRented ? (
          <Badge className="bg-green-600 text-white mb-2 ml-2">Alquilado</Badge>
        ) : (
          <Badge className="bg-gray-400 text-white mb-2 ml-2">Disponible</Badge>
        )
      )}

      <div className="flex items-center gap-2">
        {getIcon()}
        <CardTitle className="text-xl line-clamp-1">{getTitle()}</CardTitle>
      </div>
      <CardDescription className="mt-1">{getSubtitle()}</CardDescription>
    </div>
  </div>
</CardHeader>


        <CardContent className="pb-2">
          {/* Miniatura de imagen para artwork */}
          {assetType === 'artwork' && asset.photoPaths?.length > 0 && (
            <div className="mb-3">
              <img
                src={`/${asset.photoPaths[0]}`}
                alt="Miniatura obra"
                className="w-full h-40 object-cover rounded-md"
              />
            </div>
          )}
          {assetType === 'property' && (
            <div className="mt-2 text-sm space-y-1 text-muted-foreground">
              {assetType === 'property' && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Propietario:</span>
                  <span>{getOwnerName()}</span>
                </div>
              )}


              {asset.notary && (
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold">Notaría:</span>
                  <span>{asset.notary}</span>
                </div>
              )}
              {Array.isArray(asset.locals) && (
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold">Locales:</span>
                  <span>{asset.locals.length}</span>
                </div>
              )}
              {asset.deedDate || asset.acquisitionDate ? (
                <div className="flex items-baseline gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Fecha:</span>
                  <span>
                    {asset.deedDate
                      ? formatDate(asset.deedDate)
                      : formatDate(asset.acquisitionDate)}
                  </span>
                </div>
              ) : null}
              {(asset.valor_total || asset.value) ? (
                <div className="flex items-baseline gap-1">
                  {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                  <span className="font-semibold">Valor:</span>
                  <span>
                    {formatCurrency(asset.valor_total || asset.value) + ' MXN'}
                  </span>
                </div>
              ) : null}
            </div>
          )}


          {/* Ubicación */}
          {getLocation() && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">{getLocation()}</span>
            </div>
          )}

          {/* Descripción */}
          {asset.description && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">{asset.description}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <div>
            {assetType === 'property' && (
              <Link to={`/properties/${asset._id}`}>
                <Button variant="ghost" size="sm">Ver Inmueble</Button>
              </Link>
            )}
            {assetType === 'artwork' && (
              <Link to={`/artworks/${asset.id}`}>
                <Button variant="ghost" size="sm">Ver Obra</Button>
              </Link>
            )}
          </div>

          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(asset)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(asset._id)}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AssetCard;
