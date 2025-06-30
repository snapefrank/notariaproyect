import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundMessage = ({ onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Documento no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El documento que está buscando no existe o ha sido eliminado.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onBack}
        >
          Volver a Documentos
        </Button>
      </div>
    </div>
  );
};

export default NotFoundMessage;