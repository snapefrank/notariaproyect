import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RelatedDocumentInfo = ({ property, relatedDocuments }) => {
  if (!property) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Relacionados</CardTitle>
        <CardDescription>Documentos vinculados a este inmueble</CardDescription>
      </CardHeader>
      <CardContent>
        {relatedDocuments && relatedDocuments.length > 0 ? (
          <ul className="space-y-4">
            {relatedDocuments.map((doc) => (
              <li key={doc._id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-sm text-muted-foreground">{doc.category}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/documents/${doc._id}`}>Ver</Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">No hay documentos relacionados</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Este inmueble aún no tiene documentos vinculados.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/documents">Ver todos los documentos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RelatedDocumentInfo;
