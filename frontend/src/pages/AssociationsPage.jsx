import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssociations } from '@/contexts/AssociationContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import SearchBar from '@/components/SearchBar';
import AssociationForm from '@/components/AssociationForm';
import { Plus, Filter, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

const AssociationsPage = () => {
  const navigate = useNavigate();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { associations, addAssociation, updateAssociation, deleteAssociation } = useAssociations();

  const handleSearch = (query) => setSearchTerm(query);

  const filteredAssociations = () => {
    if (!searchTerm) return associations;
    const term = searchTerm.toLowerCase();
    return associations.filter(association =>
      association.nombre?.toLowerCase().includes(term) ||
      association.tipo?.toLowerCase().includes(term)
    );
  };

  const handleAddAssociation = async (formData) => {
    await addAssociation(formData);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (association) => {
    setSelectedAssociation(association);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAssociation = async (updatedData) => {
    if (!selectedAssociation) return;
    await updateAssociation(selectedAssociation._id, updatedData);
    setIsEditDialogOpen(false);
    setSelectedAssociation(null);
  };

  const handleDeleteClick = (association) => {
    setSelectedAssociation(association);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAssociation = async () => {
    if (!selectedAssociation) return;
    await deleteAssociation(selectedAssociation._id);
    setIsDeleteDialogOpen(false);
    setSelectedAssociation(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Asociaciones</h1>
          <p className="text-muted-foreground mt-2">
            Gestione todas las asociaciones registradas en el sistema.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Agregar Asociación</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Agregar Asociación</DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar una asociación en el sistema.
              </DialogDescription>
            </DialogHeader>
            <AssociationForm
              onSubmit={handleAddAssociation}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre o tipo..." />
      </div>

      {filteredAssociations().length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAssociations().map((association) => (
            <div
              key={association._id}
              className="p-4 border rounded-md shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{association.nombre}</h2>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-gray-700">RFC:</span>{' '}
                {association.rfc || 'No registrado'}
              </p>

              <div className="mt-2 flex justify-between items-center">
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => navigate(`/associations/${association._id}`)}
                >
                  Ver detalles
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(association)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(association)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No se encontraron asociaciones</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? 'No hay resultados para su búsqueda.'
              : 'No hay asociaciones registradas en el sistema.'}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}

      {/* Editar asociación */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Asociaciónss</DialogTitle>
          </DialogHeader>
          {selectedAssociation && (
            <AssociationForm
              initialData={selectedAssociation}
              onSubmit={handleUpdateAssociation}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer. ¿Desea eliminar la asociación "
            {selectedAssociation?.nombre}"?
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAssociation}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssociationsPage;
