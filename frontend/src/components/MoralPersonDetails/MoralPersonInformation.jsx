import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiBase } from '@/lib/constants';
import axios from 'axios';

const MoralPersonInformation = ({ person, onRefresh }) => {
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

  const handleDeleteDocument = async (filePath) => {
    if (!filePath) return alert('❌ Archivo no encontrado');

    const docId = filePath.split('/').pop();

    if (!window.confirm('¿Seguro que deseas eliminar este documento?')) return;

    try {
      await axios.delete(`${apiBase}/api/moral-persons/${person._id}/document/${docId}`);
      alert('✅ Documento eliminado correctamente');

      if (onRefresh) {
        onRefresh(); // 🔄 refresca datos
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('❌ Error al eliminar documento:', err);
      alert('❌ Hubo un error al eliminar el documento');
    }
  };


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
                <div className="flex gap-2">
                  <a href={buildFileUrl(person.rfcFile)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Ver archivo
                    </Button>
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (!window.confirm('¿Seguro que deseas eliminar el archivo de RFC?')) return;
                      try {
                        await axios.delete(`${apiBase}/api/moral-persons/${person._id}/rfc`);
                        alert('✅ RFC eliminado correctamente');
                        if (onRefresh) {
                          onRefresh();
                        } else {
                          window.location.reload();
                        }
                      } catch (err) {
                        console.error('❌ Error al eliminar RFC:', err);
                        alert('❌ Error al eliminar el RFC');
                      }
                    }}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
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
                    <div className="flex gap-2">
                      <a href={buildFileUrl(docPath)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Ver archivo
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDocument(docPath)}
                        className="bg-red-600 text-white"
                      >
                        🗑
                      </Button>
                    </div>
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