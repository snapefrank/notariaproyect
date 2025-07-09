import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Tag, Edit, Trash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const DocumentCard = ({ document, onEdit, onDelete }) => {
  const { _id, title, description, type, category, createdAt, tags, fileUrl } = document;

  const typeColors = {
    property: 'bg-blue-100 text-blue-800',
    artwork: 'bg-purple-100 text-purple-800',
    other: 'bg-amber-100 text-amber-800'
  };

  const categoryColors = {
    legal: 'bg-green-100 text-green-800',
    contract: 'bg-indigo-100 text-indigo-800',
    certificate: 'bg-pink-100 text-pink-800',
    insurance: 'bg-orange-100 text-orange-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="document-card"
    >
      <Card className="h-full overflow-hidden border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={typeColors[type] || 'bg-gray-100'}>
                  {type === 'property' ? 'Inmueble' : type === 'artwork' ? 'Obra de Arte' : 'Otro'}
                </Badge>
                <Badge variant="outline" className={categoryColors[category] || 'bg-gray-100'}>
                  {category === 'legal' ? 'Legal' :
                    category === 'contract' ? 'Contrato' :
                      category === 'certificate' ? 'Certificado' :
                        category === 'insurance' ? 'Seguro' : category}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
            </div>
          </div>
          <CardDescription className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 3).map((tag, index) => (
                <div key={index} className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
              {tags.length > 3 && (
                <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  +{tags.length - 3}
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/documents/${_id}`}>Ver detalles</Link>
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(document)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(_id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
