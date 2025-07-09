import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhysicalPersonForm from '@/components/PhysicalPersonForm';
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
import { Plus, Filter, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePhysicalPersons } from '@/contexts/PhysicalPersonContext';





const PhysicalPersonsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { physicalPersons, addPhysicalPerson, updatePhysicalPerson, deletePhysicalPerson, fetchAllPhysicalPersons } = usePhysicalPersons();
  const navigate = useNavigate();

  useEffect(() => {
  fetchAllPhysicalPersons(); // 🔄 Recargar lista completa al entrar a esta página
}, []);

  const handleAddPerson = async (formData) => {
    const savedPerson = await addPhysicalPerson(formData);
    setIsAddDialogOpen(false);
    return savedPerson; // Esto permite que PhysicalPersonForm reciba el ID

  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePerson = (updatedData) => {
    if (!selectedPerson) return;
    updatePhysicalPerson(selectedPerson._id || selectedPerson.id, updatedData);
    setIsEditDialogOpen(false);
    setSelectedPerson(null);
  };

  const handleDeleteClick = (person) => {
    setSelectedPerson(person);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePerson = async (id) => {
    try {
      await deletePhysicalPerson(id);
      await fetchAllPhysicalPersons(); // ✅ Refrescar lista tras eliminar
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error al eliminar persona:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const filteredPersons = () => {
    if (!searchTerm) return physicalPersons;
    const term = searchTerm.toLowerCase();
    return physicalPersons.filter(person =>
      person.nombres.toLowerCase().includes(term) ||
      person.apellidoMaterno.toLowerCase().includes(term) ||
      person.apellidoPaterno.toLowerCase().includes(term)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Personas Físicas</h1>
          <p className="text-muted-foreground mt-2">
            Gestione todas las personas físicas registradas en el sistema.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Agregar Persona Física</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Agregar Persona Fisica</DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar una Persona Fisica
              </DialogDescription>
            </DialogHeader>
            <PhysicalPersonForm
              type="physicalPersons"
              onSubmit={handleAddPerson}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre o apellido..." />
      </div>

      {filteredPersons().length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPersons().map((person) => (
            <div key={person._id || person.id || `${person.nombres}-${person.rfc}`} className="p-4 border rounded-md shadow-sm bg-white">
              <h2 className="text-lg font-semibold">
                {person.nombres} {person.apellidoPaterno} {person.apellidoMaterno}
              </h2>
              <p className="text-sm text-muted-foreground">RFC: {person.rfc}</p>
              <p className="text-sm text-muted-foreground">CURP: {person.curp}</p>
              <div className="mt-2 flex justify-between items-center">
                <Button variant="link" className="text-sm" onClick={() => navigate(`/personas-fisicas/${person._id || person.id}`)}>
                  Ver detalles
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(person)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(person)}>
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
          <h2 className="text-xl font-semibold">No se encontraron personas físicas</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? 'No hay resultados para su búsqueda.' : 'No hay personas físicas registradas en el sistema.'}
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

      {/* Diálogo para editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Persona Física</DialogTitle>
          </DialogHeader>
          {selectedPerson && (
            <PhysicalPersonForm
              initialData={selectedPerson}
              onSubmit={handleUpdatePerson}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer. ¿Desea eliminar a {selectedPerson?.nombres} {selectedPerson?.apellidos}?
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleDeletePerson(selectedPerson._id || selectedPerson.id)}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhysicalPersonsPage;
