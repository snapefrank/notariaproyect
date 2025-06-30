import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotFoundMessage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[40vh]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Persona moral no encontrada.</h2>
        <p className="text-muted-foreground mt-2">
          Verifique el enlace o intente nuevamente.
        </p>
      </div>
    </div>
  );
};

export default NotFoundMessage;
