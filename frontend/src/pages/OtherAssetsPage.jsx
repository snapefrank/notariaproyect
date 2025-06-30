import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { useAssets } from '@/contexts/AssetContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AssetCard from '@/components/AssetCard';
import AssetForm from '@/components/AssetForm';
import SearchBar from '@/components/SearchBar';

const OtherAssetsPage = () => {
  const { otherAssets, addOtherAsset, updateOtherAsset, deleteOtherAsset } = useAssets();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const handleSearch = (query) => {
    setSearchTerm(query);
  };
  
  const handleAddAsset = (formData) => {
    addOtherAsset(formData);
    setIsAddDialogOpen(false);
  };
  
  const handleEditAsset = (asset) => {
    setCurrentAsset(asset);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateAsset = (formData) => {
    updateOtherAsset(currentAsset.id, formData);
    setIsEditDialogOpen(false);
    setCurrentAsset(null);
  };
  
  const handleDeleteClick = (id) => {
    setAssetToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (assetToDelete) {
      deleteOtherAsset(assetToDelete);
      setIsDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };
  
  const filteredAssets = () => {
    let filtered = otherAssets;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(term) || 
        asset.description?.toLowerCase().includes(term)
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(asset => asset.type === typeFilter);
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
          <h1 className="text-3xl font-bold">Otros Activos</h1>
          <p className="text-muted-foreground mt-2">
            Gestione todos los activos adicionales registrados en el sistema
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Activo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Activo</DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar un nuevo activo en el sistema.
              </DialogDescription>
            </DialogHeader>
            <AssetForm 
              type="other"
              onSubmit={handleAddAsset} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} placeholder="Buscar activos..." />
        </div>
        
        <div className="w-40">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="collection">Colección</SelectItem>
              <SelectItem value="vehicle">Vehículo</SelectItem>
              <SelectItem value="jewelry">Joyería</SelectItem>
              <SelectItem value="furniture">Mobiliario</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredAssets().length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAssets().map((asset) => (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              assetType="other"
              onEdit={handleEditAsset}
              onDelete={handleDeleteClick}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No se encontraron activos</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm || typeFilter !== 'all' ? 'No hay resultados para su búsqueda o filtros.' : 'No hay activos registrados en el sistema.'}
          </p>
          {(searchTerm || typeFilter !== 'all') && (
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
          )}
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Activo</DialogTitle>
            <DialogDescription>
              Actualice la información del activo seleccionado.
            </DialogDescription>
          </DialogHeader>
          {currentAsset && (
            <AssetForm 
              type="other"
              initialData={currentAsset}
              onSubmit={handleUpdateAsset} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCurrentAsset(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El activo será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OtherAssetsPage;