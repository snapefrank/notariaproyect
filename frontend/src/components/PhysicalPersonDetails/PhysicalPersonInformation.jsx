import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
  }
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
                  href={`${BACKEND_URL}/${person.documentos.rfc}`}
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
                  href={`${BACKEND_URL}/${person.documentos.curp}`}
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
                  href={`${BACKEND_URL}/${person.documentos.nss}`}
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
          {/* Información del Seguro */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Información del Seguro</h3>
            <div className="space-y-2 p-3 bg-gray-50 rounded-md">
              {person.datosMedicos?.aseguradora ? (
                <>
                  <div><strong>Tipo de Sangre:</strong> {person.datosMedicos.tipoSangre || 'No especificado'}</div>
                  <div><strong>Aseguradora:</strong> {person.datosMedicos.aseguradora}</div>
                  <div><strong>Tipo de Seguro:</strong> {person.datosMedicos.tipoSeguro || 'No especificado'}</div>
                  <div><strong>Beneficiarios:</strong> {person.datosMedicos.beneficiarios || 'No especificado'}</div>
                  <div><strong>Inicio de Vigencia:</strong> {formatDate(person.datosMedicos.fechaInicioVigencia)}</div>
                  <div><strong>Vencimiento:</strong> {formatDate(person.datosMedicos.fechaVencimiento)}</div>
                  <div><strong>Número de Póliza:</strong> {person.datosMedicos.numeroPoliza || 'No especificado'}</div>
                  <div><strong>Prima:</strong> {person.datosMedicos.prima || 'No especificado'}</div>
                </>
              ) : (
                <span>No especificado</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
};

export default PhysicalPersonInformation;
