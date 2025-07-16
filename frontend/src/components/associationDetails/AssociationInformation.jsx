import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AssociationInformation = ({ association }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Asociación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{association.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Apoderado legal</p>
            <p className="font-medium">{association.apoderado || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Número de escritura</p>
            <p className="font-medium">{association.numeroEscritura}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fecha de escritura</p>
            <p className="font-medium">{association.fechaEscritura?.slice(0, 10)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Régimen fiscal</p>
            <p className="font-medium">{association.regimenFiscal}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">RFC</p>
            <p className="font-medium">{association.rfc}</p>
          </div>
        </div>

        {(association.deedFile || association.rfcFile || (association.additionalFiles?.length > 0)) && (
          <div className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Documentos</h3>
            <div className="space-y-3">
              {association.deedFile && (
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span>Escritura</span>
                  </div>
                  <a href={`/${association.deedFile}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">Ver</Button>
                  </a>
                </div>
              )}

              {association.rfcFile && (
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span>RFC</span>
                  </div>
                  <a href={`/${association.rfcFile}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">Ver</Button>
                  </a>
                </div>
              )}

              {association.additionalFiles && association.additionalFiles.length > 0 && (
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium mb-2">Documentos adicionales</p>
                  <div className="space-y-2">
                    {association.additionalFiles.map((filePath, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">Documento {index + 1}</span>
                        </div>
                        <a href={`/${filePath}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">Ver</Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationInformation;
