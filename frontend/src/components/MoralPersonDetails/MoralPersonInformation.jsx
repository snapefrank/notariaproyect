import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiBase } from '@/lib/constants';

const MoralPersonInformation = ({ person }) => {
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
      <Card>
        <CardHeader>
          <CardTitle>Información de la Persona Moral</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Nombre o Razón Social */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Razón Social</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{person.nombre || 'No especificada'}</span>
            </div>
          </div>

          {/* RFC */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">RFC</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span>{person.rfc || 'No especificado'}</span>
              {person.rfcFile && (
                <a
                  href={buildFileUrl(person.rfcFile)}
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

          {/* Régimen Fiscal */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Régimen Fiscal</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{person.regimenFiscal || 'No especificado'}</span>
            </div>
          </div>

          {/* Domicilio Fiscal */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Domicilio Fiscal</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{person.domicilioFiscal || 'No especificado'}</span>
            </div>
          </div>

          {/* Fecha de Constitución */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Constitución</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{formatDate(person.fechaConstitucion)}</span>
            </div>
          </div>

          {/* Documentos Adicionales */}
          {person.additionalDocs?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Documentos Adicionales</h3>
              <ul className="space-y-2">
                {person.additionalDocs.map((docPath, index) => (
                  <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span>Documento {index + 1}</span>
                    <a
                      href={buildFileUrl(docPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Ver archivo
                      </Button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoralPersonInformation;
