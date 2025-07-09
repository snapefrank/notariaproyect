import React from 'react';
import { Home, Calendar, Clock, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const typeColors = {
  residential: 'bg-blue-100 text-blue-800',
  commercial: 'bg-green-100 text-green-800',
  industrial: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-200 text-gray-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  sold: 'bg-red-100 text-red-800',
};

const PropertyHeader = ({ property, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={typeColors[property.type] || 'bg-gray-100'}>
            {property.type === 'residential'
              ? 'Residencial'
              : property.type === 'commercial'
                ? 'Comercial'
                : property.type === 'industrial'
                  ? 'Industrial'
                  : property.type
                    ? property.type.charAt(0).toUpperCase() + property.type.slice(1)
                    : 'Otros'}
          </Badge>
          <Badge variant="outline" className={statusColors[property.status] || 'bg-gray-100'}>
            {property.status === 'active' ? 'Activo' : 'Vendido'}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{property.name}</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Adquirido: {formatDate(property.acquisitionDate)}</span>
          {property.createdAt && property.updatedAt && property.createdAt !== property.updatedAt && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>Actualizado: {formatDate(property.updatedAt)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default PropertyHeader;
