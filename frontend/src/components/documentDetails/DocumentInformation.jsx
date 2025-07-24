import React, { useState } from 'react';
import { Tag, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { apiBase } from '@/lib/constants';

const DocumentInformation = ({ document: doc }) => {
  const [pdfData, setPdfData] = useState({ url: null, title: null });

  const fullUrl = doc?.fileUrl && typeof doc.fileUrl === 'string'
  ? `${apiBase}${doc.fileUrl.startsWith('/') ? '' : '/'}${doc.fileUrl}`
  : null;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h3>
          <p className="text-base">{doc.description || 'No especificado'}</p>
        </div>

        {doc.tags && doc.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {doc.tags.map((tag, index) => (
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
              <p className="font-medium">{doc.createdBy || 'No especificado'}</p>
            </div>
          </div>
        </div>

{typeof doc?.fileUrl === 'string' && fullUrl && (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-2">Archivo</h3>
    <div className="p-4 border rounded-md flex items-center justify-between bg-gray-100">
      <div className="flex items-center">
        <FileText className="h-5 w-5 text-primary mr-2" />
        <span>{doc.nombrePersonalizado?.trim() || 'Documento adjunto'}</span>
      </div>
      <div className="space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setPdfData({ url: fullUrl, title: doc.nombrePersonalizado?.trim() || 'Documento adjunto' })
          }
        >
          Visualizar
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const a = window.document.createElement('a');
            a.href = fullUrl;
            a.download = doc.nombrePersonalizado?.trim() || 'documento.pdf';
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
  </div>
)}


        {/* Modal para visualizar PDF */}
        <Dialog open={!!pdfData.url} onOpenChange={() => setPdfData({ url: null, title: null })}>
          <DialogContent className="max-w-5xl w-full h-[90vh]">
            <iframe
              src={pdfData.url}
              title={pdfData.title}
              className="w-full h-full border-none"
            ></iframe>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
};


export default DocumentInformation;
