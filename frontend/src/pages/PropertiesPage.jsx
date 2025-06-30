import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { useAssets } from '@/contexts/AssetContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import AssetCard from '@/components/AssetCard';
import AssetForm from '@/components/AssetForm';
import SearchBar from '@/components/SearchBar';
import PropertyList from '@/components/PropertyList';
import PropertyDetails from '@/pages/PropertyDetails';

const PropertiesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { properties, addProperty, updateProperty, deleteProperty } = useAssets();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const handleAddProperty = (formData) => {
    addProperty(formData);
    setIsAddDialogOpen(false);
  };

  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProperty = (formData) => {
    updateProperty(currentProperty.id, formData);
    setIsEditDialogOpen(false);
    setCurrentProperty(null);
  };

  const handleDeleteClick = (id) => {
    setPropertyToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete);
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const handleSellProperty = async (propertyId) => {
    try {
      await updateProperty(propertyId, { status: 'sold', soldDate: new Date().toISOString() });
      navigate('/sold-properties');
    } catch (error) {
      console.error('Error al vender el inmueble:', error);
    }
  };

  const filteredProperties = () => {
    let filtered = properties.filter(p => p.status === 'active'); // ✅ Mostrar solo activos

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term) ||
        property.description?.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    return filtered;
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
          <h1 className="text-3xl font-bold">Inmuebles</h1>
          <p className="text-muted-foreground mt-2">
            Gestione todos los inmuebles registrados en el sistema
          </p>
        </div>
        <Routes location={location.state?.background || location}>
          <Route index element={<PropertyList />} />
          <Route path=":id" element={<PropertyDetails />} />
        </Routes>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Inmueble</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Inmueble</DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar un nuevo inmueble en el sistema.
              </DialogDescription>
            </DialogHeader>
            <AssetForm
              type="property"
              onSubmit={handleAddProperty}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} placeholder="Buscar inmuebles..." />
        </div>

        <div className="w-40">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="residential">Residencial</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProperties().length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProperties().map((property) => (
            <AssetCard
              key={property.id}
              asset={property}
              assetType="property"
              onEdit={handleEditProperty}
              onDelete={handleDeleteClick}
              extraActions={
                <Button onClick={() => handleSellProperty(property.id)}>
                  Vender
                </Button>
              }
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No se encontraron inmuebles</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? 'No hay resultados para su búsqueda.' : 'No hay inmuebles activos que coincidan con los filtros seleccionados.'}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Inmueble</DialogTitle>
            <DialogDescription>
              Actualice la información del inmueble seleccionado.
            </DialogDescription>
          </DialogHeader>
          {currentProperty && (
            <AssetForm
              type="property"
              initialData={currentProperty}
              onSubmit={handleUpdateProperty}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCurrentProperty(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El inmueble será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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

export default PropertiesPage;
