import React from 'react';
import { FileText, Calendar, Clock, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const typeColors = {
  property: 'bg-blue-100 text-blue-800',
  artwork: 'bg-purple-100 text-purple-800',
  other: 'bg-amber-100 text-amber-800'
};

const categoryColors = {
  legal: 'bg-green-100 text-green-800',
  contract: 'bg-indigo-100 text-indigo-800',
  certificate: 'bg-pink-100 text-pink-800',
  insurance: 'bg-orange-100 text-orange-800'
};

const DocumentHeader = ({ document, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={typeColors[document.type] || 'bg-gray-100'}>
            {document.type === 'property' ? 'Inmueble' : document.type === 'artwork' ? 'Obra de Arte' : 'Otro'}
          </Badge>
          <Badge variant="outline" className={categoryColors[document.category] || 'bg-gray-100'}>
            {document.category === 'legal' ? 'Legal' : 
             document.category === 'contract' ? 'Contrato' : 
             document.category === 'certificate' ? 'Certificado' : 
             document.category === 'insurance' ? 'Seguro' : document.category}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{document.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Creado: {formatDate(document.createdAt)}</span>
          {document.createdAt !== document.updatedAt && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>Actualizado: {formatDate(document.updatedAt)}</span>
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

export default DocumentHeader;