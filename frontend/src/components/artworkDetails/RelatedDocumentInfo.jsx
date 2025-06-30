import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RelatedDocumentInfo = ({ artwork, relatedDocument }) => {
  if (!artwork) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documento Relacionado</CardTitle>
        <CardDescription>Información sobre el documento vinculado a esta obra de arte</CardDescription>
      </CardHeader>
      <CardContent>
        {relatedDocument ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{relatedDocument.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {relatedDocument.category === 'legal' ? 'Legal' :
                   relatedDocument.category === 'contract' ? 'Contrato' :
                   relatedDocument.category === 'certificate' ? 'Certificado' :
                   relatedDocument.category === 'insurance' ? 'Seguro' : 'Otro'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-md space-y-2">
              {relatedDocument.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="font-medium">{relatedDocument.description}</p>
                </div>
              )}
              {relatedDocument.createdBy && (
                <div>
                  <p className="text-sm text-muted-foreground">Creado por</p>
                  <p className="font-medium">{relatedDocument.createdBy}</p>
                </div>
              )}
              {relatedDocument.status && (
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{relatedDocument.status === 'active' ? 'Activo' : 'Inactivo'}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-medium">No hay documento relacionado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Esta obra de arte no está vinculada a ningún documento.
            </p>
          </div>
        )}
      </CardContent>

      {relatedDocument && (
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/documents">Ver todos los documentos</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RelatedDocumentInfo;
