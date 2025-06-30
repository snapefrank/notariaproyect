import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Cargando persona física...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
