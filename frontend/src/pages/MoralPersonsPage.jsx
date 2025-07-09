import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import MoralPersonForm from '@/components/MoralPersonForm';
import SearchBar from '@/components/SearchBar';
import { useMoralPersons } from '@/contexts/MoralPersonContext';

const MoralPersonsPage = () => {
  const navigate = useNavigate();
  const { moralPersons, addMoralPerson, updateMoralPerson, deleteMoralPerson } = useMoralPersons();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPerson = async (formData) => {
    await addMoralPerson(formData);
    setIsAddDialogOpen(false);
  };

  const handleEditPerson = async (formData) => {
    await updateMoralPerson(selectedPerson._id, formData);
    setIsEditDialogOpen(false);
  };

  const handleDeletePerson = async () => {
    await deleteMoralPerson(selectedPerson._id);
    setIsDeleteDialogOpen(false);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const filteredPersons = moralPersons.filter((person) => {
    const term = searchTerm.toLowerCase();
    return (
      person.nombre?.toLowerCase().includes(term) ||
      person.rfc?.toLowerCase().includes(term)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado y botón agregar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Personas Morales</h1>
          <p className="text-muted-foreground mt-2">
            Gestione todas las personas morales registradas en el sistema.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Agregar Persona Moral</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Agregar Persona Moral</DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar una Persona Moral
              </DialogDescription>
            </DialogHeader>
            <MoralPersonForm
              onSubmit={handleAddPerson}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar por nombre o RFC..."
        />
      </div>

      {/* Resultados */}
      {filteredPersons.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPersons.map((person) => (
            <div
              key={person._id}
              className="p-4 border rounded-md shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{person.nombre}</h2>
              <p className="text-sm text-muted-foreground">RFC: {person.rfc}</p>
              <div className="mt-2 flex justify-between items-center">
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => navigate(`/personas-morales/${person._id}`)}
                >
                  Ver detalles
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedPerson(person);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedPerson(person);
                      setIsDeleteDialogOpen(true);
                    }}
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
          <h2 className="text-xl font-semibold">No se encontraron personas morales</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? 'No hay resultados para su búsqueda.'
              : 'No hay personas morales registradas en el sistema.'}
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

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Persona Moral</DialogTitle>
          </DialogHeader>
          {selectedPerson && (
            <MoralPersonForm
              initialData={selectedPerson}
              onSubmit={handleEditPerson}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer. ¿Desea eliminar a {selectedPerson?.nombre}?
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePerson}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoralPersonsPage;
