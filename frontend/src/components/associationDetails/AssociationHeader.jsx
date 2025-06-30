import React from 'react';
import { Calendar, Clock, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const typeColors = {
  civil: 'bg-blue-100 text-blue-800',
  religious: 'bg-purple-100 text-purple-800',
  political: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800'
};

const AssociationHeader = ({ association, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={typeColors[association.type] || 'bg-gray-100'}>
            {association.type === 'civil'
              ? 'Civil'
              : association.type === 'religious'
              ? 'Religiosa'
              : association.type === 'political'
              ? 'Política'
              : 'Otro'}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold">{association.name}</h1>

        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Creado: {formatDate(association.createdAt)}</span>
          {association.createdAt !== association.updatedAt && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>Actualizado: {formatDate(association.updatedAt)}</span>
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

export default AssociationHeader;
