import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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


// --- helpers seguros para rutas (string u objeto { url }) ---
const getUrl = (p) => {
  if (!p) return '';
  if (typeof p === 'string') return p;
  if (typeof p === 'object' && typeof p.url === 'string') return p.url;
  return '';
};

const normPath = (p = '') => String(p).replace(/\\/g, '/');
const ensureLeadingSlash = (p = '') => (p.startsWith('/') ? p : `/${p}`);

const buildFileUrl = (p) => {
  const raw = getUrl(p);
  if (!raw) return '';
  const normalized = ensureLeadingSlash(normPath(raw));
  return `${apiBase}${normalized}`;
};

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

  const { toast } = useToast();

  const [confirmDelete, setConfirmDelete] = React.useState({
    open: false,
    targetUrl: null
  });

const handleDeleteDocument = async () => {
  if (!confirmDelete.targetUrl) return;
  const filePath = confirmDelete.targetUrl;
  const docId = normPath(filePath).split('/').pop();

  try {
    await axios.delete(`${apiBase}/api/moral-persons/${person._id}/document/${docId}`);
    setConfirmDelete({ open: false, targetUrl: null });

    toast({
      title: 'Documento eliminado',
      description: 'El documento se eliminó correctamente.',
    });

    if (onRefresh) onRefresh();
  } catch (err) {
    console.error('❌ Error al eliminar documento:', err);
    setConfirmDelete({ open: false, targetUrl: null });

    toast({
      title: 'Error al eliminar',
      description: 'Hubo un problema al eliminar el documento.',
      variant: 'destructive',
    });
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

          {Array.isArray(person.additionalDocs) && person.additionalDocs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Documentos Adicionales</h3>
              <ul className="space-y-2">
                {person.additionalDocs.map((doc, index) => {
                  const url = getUrl(doc);
                  if (!url) return null;

                  const label = (typeof doc === 'object' && doc?.nombre)
                    ? doc.nombre
                    : `Documento ${index + 1}`;

                  const href = buildFileUrl(doc);

                  return (
                    <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="truncate">{label}</span>
                      <div className="flex gap-2">
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Ver archivo
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 text-white"
                          onClick={() => setConfirmDelete({ open: true, targetUrl: url })}
                        >
                          🗑
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </CardContent>
      </Card>
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

export default MoralPersonInformation;