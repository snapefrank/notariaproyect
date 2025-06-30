import React from 'react';
import { Calendar, Clock, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const styleColors = {
  painting: 'bg-yellow-100 text-yellow-800',
  sculpture: 'bg-gray-200 text-gray-800',
  photography: 'bg-cyan-100 text-cyan-800',
  other: 'bg-slate-100 text-slate-800',
};

const ArtworkHeader = ({ artwork, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={styleColors[artwork.style] || 'bg-gray-100'}>
            {artwork.style || 'Sin estilo'}
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Obra de Arte
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{artwork.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Creado: {formatDate(artwork.createdAt)}</span>
          {artwork.createdAt !== artwork.updatedAt && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>Actualizado: {formatDate(artwork.updatedAt)}</span>
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

export default ArtworkHeader;
