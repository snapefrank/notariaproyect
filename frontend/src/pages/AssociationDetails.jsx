import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

import { useAssociations } from '@/contexts/AssociationContext';

import AssociationForm from '@/components/AssociationForm';
import AssociationHeader from '@/components/associationDetails/AssociationHeader';
import AssociationInformation from '@/components/associationDetails/AssociationInformation';
import LoadingSpinner from '@/components/associationDetails/LoadingSpinner';
import NotFoundMessage from '@/components/associationDetails/NotFoundMessage';

const AssociationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { associations, getAssociationById, updateAssociation, deleteAssociation } = useAssociations();

  const [association, setAssociation] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssociationData = () => {
      const found = getAssociationById(id);
      if (found) {
        setAssociation(found);
      }
      setIsLoading(false);
    };

    fetchAssociationData();
  }, [id, associations, getAssociationById]);

  const handleUpdateAssociation = (formData) => {
    updateAssociation(id, formData);
    setAssociation(prev => ({ ...prev, ...formData }));
    setIsEditDialogOpen(false);
  };

  const handleDeleteAssociation = () => {
    deleteAssociation(id);
    setIsDeleteDialogOpen(false);
    navigate('/associations');
  };

  if (isLoading) return <LoadingSpinner />;
  if (!association) return <NotFoundMessage onBack={() => navigate('/associations')} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/associations')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Asociaciones
        </Button>
        <AssociationHeader
          association={association}
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
          <AssociationInformation association={association} />
        </motion.div>

        {/* Si después hay información relacionada, puedes agregarla aquí */}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Asociación</DialogTitle>
            <DialogDescription>Actualice la información de la asociación.</DialogDescription>
          </DialogHeader>
          <AssociationForm
            initialData={association}
            onSubmit={handleUpdateAssociation}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La asociación será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAssociation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssociationDetails;
