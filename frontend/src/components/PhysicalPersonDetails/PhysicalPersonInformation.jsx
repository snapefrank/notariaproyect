import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { apiBase } from '@/lib/constants';

const PhysicalPersonInformation = ({ person }) => {
  const [pdfData, setPdfData] = useState({ url: null, title: null });

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

  const DocumentItem = ({ label, filePath }) => (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
      <span>{label}</span>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPdfData({ url: buildFileUrl(filePath), title: label })}
        >
          Visualizar
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            const a = document.createElement('a');
            a.href = buildFileUrl(filePath);
            a.download = label;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          Descargar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* TARJETA DE INFORMACIÓN PERSONAL */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personals</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* RFC */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">RFC</h3>
            {person.documentos?.rfc ? (
              <DocumentItem label="RFC" filePath={person.documentos.rfc} />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">No especificado</div>
            )}
          </div>

          {/* CURP */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">CURP</h3>
            {person.documentos?.curp ? (
              <DocumentItem label="CURP" filePath={person.documentos.curp} />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">No especificado</div>
            )}
          </div>

          {/* NSS */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">NSS</h3>
            {person.documentos?.nss ? (
              <DocumentItem label="NSS" filePath={person.documentos.nss} />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">No especificado</div>
            )}
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

          {/* Documentos adicionales */}
          {person.documentosAdicionales?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Documentos Personales Adicionales</h3>
              <div className="space-y-2">
                {person.documentosAdicionales.map((doc, index) => (
                  <DocumentItem
                    key={index}
                    label={doc.nombre || `Documento ${index + 1}`}
                    filePath={doc.url}
                  />
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* MODAL PARA VER PDF */}
      <Dialog open={!!pdfData.url} onOpenChange={() => setPdfData({ url: null, title: null })}>
        <DialogContent className="max-w-5xl w-full h-[90vh]">
          <iframe
            src={pdfData.url}
            title={pdfData.title}
            className="w-full h-full border-none"
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhysicalPersonInformation;
