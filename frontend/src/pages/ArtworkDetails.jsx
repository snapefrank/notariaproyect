import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

import { useArtworks } from '@/contexts/ArtworkContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

import ArtworkForm from '@/components/ArtworkForm';
import ArtworkHeader from '@/components/artworkDetails/ArtworkHeader';
import ArtworkInformation from '@/components/artworkDetails/ArtworkInformation';
import RelatedDocumentInfo from '@/components/artworkDetails/RelatedDocumentInfo';
import LoadingSpinner from '@/components/artworkDetails/LoadingSpinner';
import NotFoundMessage from '@/components/artworkDetails/NotFoundMessage';

// 🔧 Rutas base (puedes mover esto a un archivo apiRoutes.js si deseas)
const BASE_URL = import.meta.env.VITE_API_URL;
const ARTWORK_API = `${BASE_URL}/api/artworks`;
const PHYSICAL_PERSON_API = `${BASE_URL}/api/physical-persons`;
const MORAL_PERSON_API = `${BASE_URL}/api/moral-persons`;

const ArtworkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    artworks,
    getArtworkById,
    updateArtwork,
    deleteArtwork,
    getDocumentById
  } = useArtworks();

  const [artwork, setArtwork] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [relatedDocument, setRelatedDocument] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtworkData = async () => {
      let foundArtwork = getArtworkById(id);

      if (!foundArtwork) {
        try {
          const response = await axios.get(`${ARTWORK_API}/${id}`);
          foundArtwork = response.data;
        } catch (error) {
          console.error('Error al obtener la obra de arte desde el backend:', error);
          setIsLoading(false);
          return;
        }
      }

      setArtwork(foundArtwork);

      // Determinar el nombre del propietario
      if (foundArtwork.ownerExternalName) {
        setOwnerName(foundArtwork.ownerExternalName);
      } else if (foundArtwork.ownerId && foundArtwork.ownerType) {
        try {
          const endpoint = foundArtwork.ownerType === 'PhysicalPerson'
            ? `${PHYSICAL_PERSON_API}/${foundArtwork.ownerId}`
            : `${MORAL_PERSON_API}/${foundArtwork.ownerId}`;

          const response = await axios.get(endpoint);
          const person = response.data;

          setOwnerName(person.name || 'Propietario sin nombre');
        } catch (error) {
          console.error('No se pudo obtener el nombre del propietario:', error);
          setOwnerName('Propietario no encontrado');
        }
      } else {
        setOwnerName('No especificado');
      }

      if (foundArtwork.documentId) {
        const doc = getDocumentById(foundArtwork.documentId);
        setRelatedDocument(doc);
      }

      setIsLoading(false);
    };

    fetchArtworkData();
  }, [id, artworks, getArtworkById, getDocumentById]);

  const handleUpdateArtwork = (formData) => {
    updateArtwork(id, formData);
    setArtwork((prev) => ({ ...prev, ...formData }));
    setIsEditDialogOpen(false);
  };

  const handleDeleteArtwork = () => {
    deleteArtwork(id);
    setIsDeleteDialogOpen(false);
    navigate('/artworks');
  };

  if (isLoading) return <LoadingSpinner />;
  if (!artwork) return <NotFoundMessage onBack={() => navigate('/artworks')} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/artworks')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Obras de Arte
        </Button>
        <ArtworkHeader
          artwork={artwork}
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
          <ArtworkInformation artwork={artwork} ownerName={ownerName} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <RelatedDocumentInfo artwork={artwork} relatedDocument={relatedDocument} />
        </motion.div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Obra de Arte</DialogTitle>
            <DialogDescription>Actualice la información de la obra de arte.</DialogDescription>
          </DialogHeader>
          <ArtworkForm
            initialData={artwork}
            onSubmit={handleUpdateArtwork}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La obra será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteArtwork}
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

export default ArtworkDetails;
