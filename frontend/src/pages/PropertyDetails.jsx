import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssets } from '@/contexts/AssetContext';
import { useDocuments } from '@/contexts/DocumentContext';
import PropertyHeader from '@/components/propertyDetails/PropertyHeader';
import PropertyInformation from '@/components/propertyDetails/PropertyInformation';
import RelatedDocumentInfo from '@/components/propertyDetails/RelatedDocumentInfo';
import LoadingSpinner from '@/components/propertyDetails/LoadingSpinner';
import NotFoundMessage from '@/components/propertyDetails/NotFoundMessage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AssetForm from '@/components/AssetForm';
import Accordion from '@/components/ui/Accordion'; // ✅ Solo esta importación
import { apiBase } from '@/lib/constants'; // o desde donde lo tengas definido

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, updateProperty, deleteProperty } = useAssets();
  const { documents } = useDocuments();

  const [property, setProperty] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);

  const [sellDate, setSellDate] = useState('');
  const [sellNote, setSellNote] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const foundProperty = getPropertyById(id);
    if (foundProperty) {
      setProperty(foundProperty);

      const docs = documents.filter(
        (doc) => doc.type === 'property' && doc.propertyId === id
      );
      setRelatedDocuments(docs);
    }
    setIsLoading(false);
  }, [id, getPropertyById, documents]);

  const handleEdit = () => setIsEditDialogOpen(true);

  const handleDelete = () => {
    deleteProperty(id);
    navigate('/properties');
  };

  const handleSellProperty = async () => {
    if (!sellDate) {
      alert('La fecha de venta es obligatoria.');
      return;
    }

    const updated = {
      ...property,
      status: 'sold',
      soldDate: sellDate,
      soldNote: sellNote,
    };

    try {
      await updateProperty(id, updated);
      setShowSellDialog(false);
      navigate(`/inmuebles-vendidos/${id}`);
    } catch (error) {
      console.error('Error al marcar como vendido:', error);
      alert('Ocurrió un error al actualizar el inmueble.');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!property) return <NotFoundMessage onBack={() => navigate('/properties')} />;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Volver a Inmuebles
      </Button>

      <PropertyHeader
        property={property}
        onEdit={handleEdit}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <PropertyInformation property={property} />

      {/* Visualización de locales */}
      {property.locals && property.locals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Locales dentro del inmueble</h2>
          {property.locals.map((local, index) => (
            <Accordion key={index} title={`Local ${index + 1} – Arrendatario: ${local.tenant || 'Sin definir'}`}>
              <p><strong>Superficie rentada:</strong> {local.rentedArea} m²</p>
              <p><strong>Costo de renta:</strong> ${local.rentCost}</p>
              <p><strong>Inicio de renta:</strong> {local.rentStartDate?.substring(0, 10)}</p>
              <p><strong>Fin de renta:</strong> {local.rentEndDate?.substring(0, 10)}</p>
              {local.rentContractUrl && (
                <p>
                  <strong>Contrato:</strong>{' '}
                  <a href={`/uploads/locals/contracts/${local.rentContractUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Ver contrato
                  </a>
                </p>
              )}
              {local.photos && local.photos.length > 0 && (
                <div className="pt-4 border-t mt-4">
                  <h4 className="text-sm font-semibold mb-2">Fotos del local</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {local.photos.map((filename, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(`${apiBase}/uploads/locals/photos/${filename}`)}
                        className="focus:outline-none"
                      >
                        <img
                          src={`${apiBase}/uploads/locals/photos/${filename}`}
                          alt={`Foto ${i + 1}`}
                          className="rounded-md w-full h-32 object-cover shadow-sm hover:ring-2 hover:ring-blue-500"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Accordion>
          ))}
        </div>
      )}

      <RelatedDocumentInfo
        property={property}
        relatedDocuments={relatedDocuments}
      />

      {property.status !== 'sold' && (
        <div className="pt-4">
          <Button onClick={() => setShowSellDialog(true)}>
            Marcar como Vendido
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro que desea vender este inmueble?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              placeholder="Fecha de venta"
            />
            <Textarea
              placeholder="Nota adicional (opcional)"
              value={sellNote}
              onChange={(e) => setSellNote(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowSellDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSellProperty}>
                Confirmar Venta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Inmueble</DialogTitle>
          </DialogHeader>
          {property && (
            <AssetForm
              type="property"
              initialData={property}
              onSubmit={(formData) => {
                updateProperty(id, formData);
                setIsEditDialogOpen(false);
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea eliminar este inmueble?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El inmueble será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <img
      src={selectedImage}
      alt="Vista ampliada"
      className="max-w-full max-h-full rounded shadow-lg"
    />
  </div>
)}
    </div>
  );
};

export default PropertyDetails;
