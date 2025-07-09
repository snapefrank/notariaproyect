import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DocumentCard from '@/components/DocumentCard';
import DocumentForm from '@/components/DocumentForm';
import SearchBar from '@/components/SearchBar';

const DocumentsPage = () => {
  const { documents, addDocument, updateDocument, deleteDocument, searchDocuments } = useDocuments();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const results = searchDocuments(query);
    setSearchResults(results);
  };

const handleAddDocument = async (formData) => {
  await addDocument(formData); // ✅ Aquí se guarda, actualiza y lanza el toast
  setIsAddDialogOpen(false);
};


  const handleEditDocument = (document) => {
    setCurrentDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDocument = (formData) => {
    updateDocument(currentDocument.id, formData);
    setIsEditDialogOpen(false);
    setCurrentDocument(null);
  };

  const handleDeleteClick = (id) => {
    setDocumentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete);
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const filteredDocuments = () => {
    let filtered = searchResults || documents;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
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
          <h1 className="text-3xl font-bold">Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Gestione todos los documentos del sistema notarial
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Documento</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Documento</DialogTitle>
              <DialogDescription>
                Complete el formulario para crear un nuevo documento en el sistema.
              </DialogDescription>
            </DialogHeader>
            <DocumentForm
              onSubmit={handleAddDocument}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} placeholder="Buscar documentos..." />
        </div>

        <div className="flex gap-2">
          <div className="w-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="property">Inmuebles</SelectItem>
                <SelectItem value="artwork">Obras de Arte</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
                <SelectItem value="certificate">Certificado</SelectItem>
                <SelectItem value="insurance">Seguro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredDocuments().length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDocuments().map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onEdit={handleEditDocument}
              onDelete={handleDeleteClick}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No se encontraron documentos</h2>
          <p className="text-muted-foreground mt-2">
            {searchResults ? 'No hay resultados para su búsqueda.' : 'No hay documentos que coincidan con los filtros seleccionados.'}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchResults(null);
              setTypeFilter('all');
              setCategoryFilter('all');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Actualice la información del documento seleccionado.
            </DialogDescription>
          </DialogHeader>
          {currentDocument && (
            <DocumentForm
              initialData={currentDocument}
              onSubmit={handleUpdateDocument}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCurrentDocument(null);
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
              Esta acción no se puede deshacer. El documento será eliminado permanentemente del sistema.
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

export default DocumentsPage;