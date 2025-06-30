import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RelatedDocuments = ({ documents, entityName = 'entidad' }) => {
  if (!documents || documents.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Documentos donde esta {entityName} está relacionada como activo
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {documents.map((doc) => (
            <li key={doc._id}>
              <Link
                to={`/documentos/${doc._id}`}
                className="text-blue-600 hover:underline"
              >
                {doc.title || 'Documento sin título'}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RelatedDocuments;
