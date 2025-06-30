import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ArtworkForm from '@/components/ArtworkForm';
import ArtworkDetails from '@/pages/ArtworkDetails';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SearchBar from '@/components/SearchBar';
import { Plus, Filter, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { useArtworks } from '@/contexts/ArtworkContext';

const ArtworksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { artworks, addArtwork, updateArtwork, deleteArtwork } = useArtworks();

  const handleAddArtwork = async (formData) => {
    await addArtwork(formData);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsEditDialogOpen(true);
  };

  const handleUpdateArtwork = async (updatedData) => {
    if (!selectedArtwork) return;
    await updateArtwork(selectedArtwork._id, updatedData);
    setIsEditDialogOpen(false);
    setSelectedArtwork(null);
  };

  const handleDeleteClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteArtwork = async () => {
    try {
      await deleteArtwork(selectedArtwork._id);
      setIsDeleteDialogOpen(false);
      setSelectedArtwork(null);
    } catch (error) {
      console.error('Error al eliminar la obra de arte:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const filteredArtworks = () => {
    if (!searchTerm) return artworks;
    const term = searchTerm.toLowerCase();
    return artworks.filter(artwork =>
      artwork.title.toLowerCase().includes(term) ||
      artwork.artist.toLowerCase().includes(term)
    );
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
      <Routes>
        <Route path="/" element={
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Piezas de Arte</h1>
                <p className="text-muted-foreground mt-2">
                  Gestione todas las piezas de arte registradas en el sistema.
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Agregar Pieza de Arte</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Agregar Pieza de Arte</DialogTitle>
                  </DialogHeader>
                  <ArtworkForm onSubmit={handleAddArtwork} onCancel={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6">
              <SearchBar onSearch={handleSearch} placeholder="Buscar por título o artista..." />
            </div>

            {filteredArtworks().length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredArtworks().map((artwork) => (
                  <div key={artwork._id} className="p-4 border rounded-md shadow-sm bg-white">
                    <h2 className="text-lg font-semibold">{artwork.title}</h2>
                    <p className="text-sm text-muted-foreground">Artista: {artwork.artist}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <Button variant="link" className="text-sm" onClick={() => navigate(`/artworks/${artwork._id}`)}>Ver detalles</Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(artwork)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(artwork)}>
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
                <h2 className="text-xl font-semibold">No se encontraron piezas de arte</h2>
                <p className="text-muted-foreground mt-2">
                  {searchTerm ? 'No hay resultados para su búsqueda.' : 'No hay piezas de arte registradas en el sistema.'}
                </p>
                {searchTerm && (
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                    Limpiar búsqueda
                  </Button>
                )}
              </div>
            )}

            {/* Diálogo para editar obra */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Editar Pieza de Arte</DialogTitle>
                </DialogHeader>
                {selectedArtwork && (
                  <ArtworkForm
                    initialData={selectedArtwork}
                    onSubmit={handleUpdateArtwork}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Está seguro?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer. ¿Desea eliminar la obra "{selectedArtwork?.title}"?
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={handleDeleteArtwork}>Eliminar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        } />
        <Route path="/:id" element={<ArtworkDetails />} />
      </Routes>
    </div>
  );
};

export default ArtworksPage;
