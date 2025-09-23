import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { apiBase } from '@/lib/constants';
import axios from 'axios';


const PhysicalPersonInformation = ({ person, onRefresh }) => {
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
  const handleDeleteDocument = async (filePath) => {
    if (!filePath) return alert('❌ Archivo no encontrado');

    // Sacar el nombre real del archivo (docId)
    const docId = filePath.split('/').pop();

    if (!window.confirm('¿Seguro que deseas eliminar este documento?')) return;

    try {
      await axios.delete(`${apiBase}/api/physical-persons/${person._id}/document/${docId}`);
      alert('✅ Documento eliminado correctamente');

      // 🔄 Refrescar datos en el padre
      if (onRefresh) {
        await onRefresh(); // 🔄 Solo refresca los datos desde el backend
      }
    } catch (err) {
      console.error('❌ Error al eliminar documento:', err);
      alert('❌ Hubo un error al eliminar el documento');
    }
  };

  const buildFileUrl = (path) => `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;

  const DocumentItem = ({ label, filePath }) => (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
      <span>{label}</span>
      <div className="space-x-2 flex items-center">
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

        {/* ✅ BOTÓN ELIMINAR */}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDeleteDocument(filePath)}
          className="bg-red-600 text-white"
        >
          🗑
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
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>{person.rfc || 'No especificado'}</span>
              {person.documentos?.rfc && (
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfData({ url: buildFileUrl(person.documentos.rfc), title: 'RFC' })}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = buildFileUrl(person.documentos.rfc);
                      a.download = 'RFC';
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(person.documentos.rfc)}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* CURP */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">CURP</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>{person.curp || 'No especificado'}</span>
              {person.documentos?.curp && (
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfData({ url: buildFileUrl(person.documentos.curp), title: 'CURP' })}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = buildFileUrl(person.documentos.curp);
                      a.download = 'CURP';
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(person.documentos.curp)}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* NSS */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">NSS</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>{person.nss || 'No especificado'}</span>
              {person.documentos?.nss && (
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfData({ url: buildFileUrl(person.documentos.nss), title: 'NSS' })}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = buildFileUrl(person.documentos.nss);
                      a.download = 'NSS';
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(person.documentos.nss)}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* RFC */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">RFC</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>{person.rfc || 'No especificado'}</span>
              {person.documentos?.rfc && (
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfData({ url: buildFileUrl(person.documentos.rfc), title: 'RFC' })}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = buildFileUrl(person.documentos.rfc);
                      a.download = 'RFC';
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(person.documentos.rfc)}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* CURP */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">CURP</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>{person.curp || 'No especificado'}</span>
              {person.documentos?.curp && (
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfData({ url: buildFileUrl(person.documentos.curp), title: 'CURP' })}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = buildFileUrl(person.documentos.curp);
                      a.download = 'CURP';
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(person.documentos.curp)}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* NSS */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">NSS</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span>{person.nss || 'No especificado'}</span>
              {person.documentos?.nss && (
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfData({ url: buildFileUrl(person.documentos.nss), title: 'NSS' })}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = buildFileUrl(person.documentos.nss);
                      a.download = 'NSS';
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(person.documentos.nss)}
                    className="bg-red-600 text-white"
                  >
                    🗑
                  </Button>
                </div>
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
