import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiBase } from '@/lib/constants';

const PhysicalPersonInformation = ({ person }) => {
  const nombreCompleto =
    person.nombreCompleto ||
    `${person.nombre || ''} ${person.apellidoPaterno || ''} ${person.apellidoMaterno || ''}`.trim();

  const formatDate = (isoString) => {
    if (!isoString) return 'No especificada';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const buildFileUrl = (path) => `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;

  return (
    <div className="space-y-6">
      {/* TARJETA DE INFORMACIÓN PERSONAL */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* RFC */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">RFC</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span>{person.rfc || 'No especificado'}</span>
              {person.documentos?.rfc && (
                <a
                  href={buildFileUrl(person.documentos.rfc)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Ver archivo
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* CURP */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">CURP</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span>{person.curp || 'No especificado'}</span>
              {person.documentos?.curp && (
                <a
                  href={buildFileUrl(person.documentos.curp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Ver archivo
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* NSS */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">NSS</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span>{person.nss || 'No especificado'}</span>
              {person.documentos?.nss && (
                <a
                  href={buildFileUrl(person.documentos.nss)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Ver archivo
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Nacimiento</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{formatDate(person.fechaNacimiento)}</span>
            </div>
          </div>

          {/* Sexo */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Sexo</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>
                {person.sexo === 'M' ? 'Masculino' : person.sexo === 'F' ? 'Femenino' : 'No especificado'}
              </span>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Dirección</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{person.direccion || 'No especificada'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalPersonInformation;
