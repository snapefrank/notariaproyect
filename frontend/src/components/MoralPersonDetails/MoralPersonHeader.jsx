import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MoralPersonHeader = ({ person, onEdit, onDelete }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl font-bold">{person.razonSocial}</h2>
      <p className="text-muted-foreground text-sm">RFC: {person.rfc}</p>
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

export default MoralPersonHeader;
