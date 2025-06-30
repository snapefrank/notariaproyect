import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
import { useMoralPersons } from '@/contexts/MoralPersonContext';
import MoralPersonHeader from '@/components/MoralPersonDetails/MoralPersonHeader';
import MoralPersonInformation from '@/components/MoralPersonDetails/MoralPersonInformation';
import RelatedDocuments from '@/components/MoralPersonDetails/RelatedDocuments';
import LoadingSpinner from '@/components/documentDetails/LoadingSpinner';
import NotFoundMessage from '@/components/documentDetails/NotFoundMessage';
import MoralPersonForm from '@/components/MoralPersonForm';

const MoralPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchMoralPersonById,
    updateMoralPerson,
    deleteMoralPerson
  } = useMoralPersons();

  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      const data = await fetchMoralPersonById(id);
      if (data) setPerson(data);
      setIsLoading(false);
    };
    fetchPerson();
  }, [id, fetchMoralPersonById]);

  const handleUpdate = async (formData) => {
    try {
      await updateMoralPerson(id, formData);
      setPerson(prev => ({ ...prev, ...formData }));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error al actualizar persona moral:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMoralPerson(id);
      setIsDeleteDialogOpen(false);
      navigate('/personas-morales');
    } catch (error) {
      console.error('Error al eliminar persona moral:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!person) return <NotFoundMessage onBack={() => navigate('/personas-morales')} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/personas-morales')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Personas
        </Button>
        <MoralPersonHeader 
          person={person} 
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
          <MoralPersonInformation person={person} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* <RelatedDocuments person={person} /> */}
        </motion.div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Persona Moral</DialogTitle>
            <DialogDescription>Actualice la información de esta persona.</DialogDescription>
          </DialogHeader>
          <MoralPersonForm
            initialData={person}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La persona será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoralPersonDetails;
