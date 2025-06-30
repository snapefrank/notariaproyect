import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Edit, Trash } from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import { useAssets } from '@/contexts/AssetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import DocumentForm from '@/components/DocumentForm';
import DocumentHeader from '@/components/documentDetails/DocumentHeader';
import DocumentInformation from '@/components/documentDetails/DocumentInformation';
import RelatedAssetInfo from '@/components/documentDetails/RelatedAssetInfo';
import LoadingSpinner from '@/components/documentDetails/LoadingSpinner';
import NotFoundMessage from '@/components/documentDetails/NotFoundMessage';

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, getDocumentById, updateDocument, deleteDocument } = useDocuments();
  const { getPropertyById, getArtworkById, getOtherAssetById } = useAssets();
  
  const [document, setDocument] = useState(null);
  const [relatedAsset, setRelatedAsset] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDocumentData = () => {
      const foundDocument = getDocumentById(id);
      
      if (foundDocument) {
        setDocument(foundDocument);
        
        if (foundDocument.type === 'property' && foundDocument.propertyId) {
          setRelatedAsset(getPropertyById(foundDocument.propertyId));
        } else if (foundDocument.type === 'artwork' && foundDocument.artworkId) {
          setRelatedAsset(getArtworkById(foundDocument.artworkId));
        } else if (foundDocument.type === 'other' && foundDocument.assetId) {
          setRelatedAsset(getOtherAssetById(foundDocument.assetId));
        }
      }
      setIsLoading(false);
    };
    
    fetchDocumentData();
  }, [id, documents, getDocumentById, getPropertyById, getArtworkById, getOtherAssetById]);
  
  const handleUpdateDocument = (formData) => {
    updateDocument(id, formData);
    setDocument(prevDoc => ({...prevDoc, ...formData}));
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteDocument = () => {
    deleteDocument(id);
    setIsDeleteDialogOpen(false);
    navigate('/documents');
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (!document) return <NotFoundMessage onBack={() => navigate('/documents')} />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/documents')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Documentos
        </Button>
        <DocumentHeader 
          document={document} 
          onEdit={() => setIsEditDialogOpen(true)} 
          onDelete={() => setIsDeleteDialogOpen(true)} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <DocumentInformation document={document} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <RelatedAssetInfo document={document} relatedAsset={relatedAsset} />
        </motion.div>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>Actualice la información del documento.</DialogDescription>
          </DialogHeader>
          <DocumentForm 
            initialData={document}
            onSubmit={handleUpdateDocument} 
            onCancel={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El documento será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentDetails;