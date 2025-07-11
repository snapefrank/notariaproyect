import React from 'react';
import { Tag, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AssociationInformation = ({ association }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Asociación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h3>
          <p className="text-base">{association.description}</p>
        </div>

        {association.tags && association.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {association.tags.map((tag, index) => (
                <div key={index} className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-muted-foreground">Creado por</p>
              <p className="font-medium">{association.createdBy}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">{association.status === 'active' ? 'Activa' : 'Inactiva'}</p>
            </div>
          </div>
        </div>

        {association.fileUrl && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Archivo</h3>
            <div className="p-4 border rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <span>Documento adjunto</span>
              </div>
              <Button variant="outline" size="sm">Ver archivo</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationInformation;
