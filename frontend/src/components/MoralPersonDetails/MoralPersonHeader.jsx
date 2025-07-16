import React from 'react';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

const MoralPersonHeader = ({ person, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">{person.nombre}</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>Creado: {formatDate(person.createdAt)}</span>
          {person.updatedAt && person.updatedAt !== person.createdAt && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>Actualizado: {formatDate(person.updatedAt)}</span>
            </>
          )}
        </div>
        <p className="text-muted-foreground text-sm mt-1">RFC: {person.rfc}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default MoralPersonHeader;
