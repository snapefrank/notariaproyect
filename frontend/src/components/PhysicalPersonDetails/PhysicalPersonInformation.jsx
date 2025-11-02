import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { apiBase } from '@/lib/constants';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';



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

  const { toast } = useToast();

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    targetUrl: null
  });

  const handleDeleteDocument = async () => {
    if (!confirmDelete.targetUrl) return;

    const filePath = confirmDelete.targetUrl;
    const docId = filePath.split('/').pop();

    try {
      await axios.delete(`${apiBase}/api/physical-persons/${person._id}/document/${docId}`);
      setConfirmDelete({ open: false, targetUrl: null });

      toast({
        title: 'Documento eliminado',
        description: 'El documento se eliminó correctamente.',
      });

      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('❌ Error al eliminar documento:', err);
      setConfirmDelete({ open: false, targetUrl: null });

      toast({
        title: 'Error al eliminar documento',
        description: 'No se pudo eliminar el archivo. Intenta nuevamente.',
        variant: 'destructive',
      });
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
          className="bg-red-600 text-white"
          onClick={() => setConfirmDelete({ open: true, targetUrl: filePath })}
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
                    className="bg-red-600 text-white"
                    onClick={() => setConfirmDelete({ open: true, targetUrl: person.documentos.rfc })}
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
                    className="bg-red-600 text-white"
                    onClick={() => setConfirmDelete({ open: true, targetUrl: person.documentos.curp })}
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
                    className="bg-red-600 text-white"
                    onClick={() => setConfirmDelete({ open: true, targetUrl: person.documentos.nss })}
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
      <AlertDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el documento seleccionado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteDocument}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PhysicalPersonInformation;
