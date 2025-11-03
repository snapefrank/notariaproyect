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
import Accordion from '@/components/ui/Accordion';
import AddLocalModal from '@/components/propertyDetails/AddLocalModal';
import EditLocalModal from '@/components/propertyDetails/EditLocalModal';
import PropertyForm from '@/components/PropertyForm';

const API_URL = import.meta.env.VITE_API_URL + '/api/properties';
const apiBase = import.meta.env.VITE_API_URL;


const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, updateProperty, deleteProperty, refreshProperty, updatePropertyStatus } = useAssets();
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
  const [showAddLocalDialog, setShowAddLocalDialog] = useState(false);
  const [editLocalIndex, setEditLocalIndex] = useState(null);
  const [showEditLocalDialog, setShowEditLocalDialog] = useState(false);
  const [localToDeleteIndex, setLocalToDeleteIndex] = useState(null);
  const [saleDocs, setSaleDocs] = useState([]);
  const [pdfData, setPdfData] = useState({ url: null, title: null });



  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        setProperty(data);

        const docs = documents.filter(
          (doc) => doc.type === 'property' && doc.propertyId === id
        );
        setRelatedDocuments(docs);
      } catch (err) {
        console.error('Error al cargar el inmueble:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, documents]);


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

    const formData = new FormData();
    formData.append('soldDate', sellDate);
    formData.append('soldNote', sellNote);
    saleDocs.forEach((file) => {
      formData.append('saleDocs', file);
    });

    try {
      const response = await fetch(`${API_URL}/${id}/mark-as-sold`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al marcar como vendido.');

      const updated = await response.json();

      // ✅ Actualiza el inmueble en el contexto global sin recargar
      updatePropertyStatus(id, updated);

      // ✅ Opcionalmente actualiza también el estado local de este componente
      setProperty(updated);

      setShowSellDialog(false);

      // ✅ Redireccionar solo si ya no quieres mostrarlo aquí
      navigate(`/inmuebles-vendidos/${id}`);
    } catch (error) {
      console.error('Error al marcar como vendido:', error);
      alert('Ocurrió un error al actualizar el inmueble.');
    }
  };



  if (isLoading) return <LoadingSpinner />;
  if (!property) return <NotFoundMessage onBack={() => navigate('/properties')} />;

  const DocumentItem = ({ label, fileUrl, onView }) => (
    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
      <span className="font-medium text-sm">{label}</span>
      <div className="space-x-2">
        <Button size="sm" variant="outline" onClick={() => onView({ url: fileUrl, title: label })}>
          Visualizar
        </Button>
        <Button size="sm" onClick={() => {
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = label || 'documento';
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}>
          Descargar
        </Button>
      </div>
    </div>
  );
  const createFormDataForProperty = (propertyData, updatedLocals) => {
    const formData = new FormData();

    // 🔹 Datos básicos del inmueble
    Object.keys(propertyData).forEach(key => {
      if (key !== "locals" && key !== "_id") {
        const value = propertyData[key];

        // ✅ Conversión de valores vacíos para evitar NaN
        if (value === "" || value === null || value === undefined) {
          return;
        }

        // ✅ Si el campo debería ser numérico, convertir a número
        if (
          ["valor_total", "encumbranceAmount", "totalArea", "rentedArea", "rentCost"].includes(key)
        ) {
          const num = Number(value);
          if (!isNaN(num)) {
            formData.append(key, num);
          }
          return;
        }

        formData.append(key, value);
      }
    });

    // 🔹 Agregar los locales actualizados
    formData.append("locals", JSON.stringify(updatedLocals));

    return formData;
  };


  const handleDeleteLocalContract = async (propertyId, localIndex) => {
    if (!window.confirm("¿Seguro que deseas eliminar el contrato de este local?")) return;

    try {
      const response = await fetch(`${API_URL}/${propertyId}/locals/${localIndex}/contract`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el contrato");

      const updatedProperty = await response.json();
      setProperty(updatedProperty.property);

      alert("✅ Contrato eliminado correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar contrato:", error);
      alert("No se pudo eliminar el contrato");
    }
  };


  const handleDeleteLocalPhoto = async (propertyId, localIndex, filename) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta foto?")) return;

    try {
      const response = await fetch(`${API_URL}/${propertyId}/locals/${localIndex}/photos/${filename}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar la foto");

      const updatedProperty = await response.json();
      setProperty(updatedProperty.property);

      alert("✅ Foto eliminada correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar foto:", error);
      alert("No se pudo eliminar la foto");
    }
  };

  const handleDeleteLocalExtraDoc = async (propertyId, localIndex, filename) => {
    if (!window.confirm("¿Seguro que deseas eliminar este documento adicional?")) return;

    try {
      const response = await fetch(`${API_URL}/${propertyId}/locals/${localIndex}/extra-docs/${filename}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el documento adicional");

      const updatedProperty = await response.json();
      setProperty(updatedProperty.property);

      alert("✅ Documento eliminado correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar documento adicional:", error);
      alert("No se pudo eliminar el documento");
    }
  };



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

      {/* Sección de locales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Locales dentro del inmueble</h2>
          <Button
            onClick={() => setShowAddLocalDialog(true)}
          >
            Agregar Local
          </Button>
        </div>

        {property.locals && property.locals.length > 0 && property.locals.map((local, index) => {
          console.log(`▶ Local ${index + 1}:`, local); // 👈 AQUI se imprime cada local
          return (
            <Accordion
              key={index}
              title={`Local ${index + 1} – ${local.name ? `Nombre: ${local.name}` : 'Sin nombre'} – Arrendatario: ${local.tenant || 'Sin definir'}`}
            >
              <p><strong>Superficie rentada:</strong> {local.rentedArea} m²</p>
              <p><strong>Costo de renta:</strong> ${local.rentCost}</p>
              <p><strong>Inicio de renta:</strong> {local.rentStartDate?.substring(0, 10)}</p>
              <p><strong>Fin de renta:</strong> {local.rentEndDate?.substring(0, 10)}</p>
              <p><strong>Clave catastral:</strong> {local.cadastralKey}</p>

              {/* 🏦 Sección de gravámenes del local */}
              {local.hasEncumbrance && local.encumbrances?.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="font-semibold text-gray-800 mb-2">Gravámenes del Local</h4>
                  {local.encumbrances.map((g, i) => (
                    <div key={i} className="mb-2 bg-gray-50 p-3 rounded-md shadow-sm">
                      <p><strong>Institución:</strong> {g.institution}</p>
                      <p><strong>Monto:</strong> ${g.amount?.toLocaleString('es-MX')}</p>
                      <p><strong>Fecha:</strong> {new Date(g.date).toLocaleDateString('es-MX')}</p>
                    </div>
                  ))}
                </div>
              )}

              {local.rentContractUrl && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Contrato de Renta</h4>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Contrato Local {index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setPdfData({ url: `${apiBase}/uploads/locals/contracts/${local.rentContractUrl}`, title: `Contrato Local ${index + 1}` })}>
                        Visualizar
                      </Button>
                      <Button size="sm" onClick={() => {
                        const a = document.createElement('a');
                        a.href = `${apiBase}/uploads/locals/contracts/${local.rentContractUrl}`;
                        a.download = `Contrato Local ${index + 1}`;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}>
                        Descargar
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-100"
                        title="Eliminar contrato"
                        onClick={() => handleDeleteLocalContract(property._id, index)}
                      >
                        🗑
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {local.extraDocs?.archivos?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Documentos adicionales</h4>
                  {local.extraDocs.archivos.map((archivo, idx) => {
                    const nombre = local.extraDocs.nombresPersonalizados?.[idx] || `Documento adicional ${idx + 1}`;
                    const url = `${apiBase}/uploads/locals/extra-docs/${archivo}`;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2"
                      >
                        <span className="font-medium text-sm">{nombre}</span>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setPdfData({ url, title: nombre })}>
                            Visualizar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = nombre;
                              a.target = "_blank";
                              a.rel = "noopener noreferrer";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                          >
                            Descargar
                          </Button>
                          {
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:bg-red-100"
                              title="Eliminar documento"
                              onClick={() => handleDeleteLocalExtraDoc(property._id, index, archivo)}
                            >
                              🗑
                            </Button>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {local.photos && local.photos.length > 0 && (
                <div className="pt-4 border-t mt-4">
                  <h4 className="text-sm font-semibold mb-2">Fotos del local</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {local.photos.map((filename, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={`${apiBase}/uploads/locals/photos/${filename}`}
                          alt={`Foto ${i + 1}`}
                          className="rounded-md w-full h-32 object-cover shadow-sm hover:ring-2 hover:ring-blue-500"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-1 right-1 text-red-500 bg-white/70 hover:bg-red-100"
                          title="Eliminar foto"
                          onClick={() => handleDeleteLocalPhoto(property._id, index, filename)}
                        >
                          🗑
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditLocalIndex(index);
                    setShowEditLocalDialog(true);
                  }}
                >
                  Editar Local
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setLocalToDeleteIndex(index)}
                >
                  Eliminar Local
                </Button>
              </div>
            </Accordion>
          );
        })}

      </div>

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
            <div>
              <label className="block text-sm font-medium mb-1">Documentos de Venta (PDF)</label>
              <Input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => setSaleDocs(Array.from(e.target.files))}
              />
            </div>

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
            <PropertyForm
              initialData={property}
              onSubmit={async (formData) => {
                try {
                  await updateProperty(id, formData);
                  const updated = await refreshProperty(id);
                  setProperty(updated);
                  setIsEditDialogOpen(false);
                } catch (error) {
                  console.error('Error al actualizar el inmueble:', error);
                  alert('Ocurrió un error al actualizar el inmueble.');
                }
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

      <AddLocalModal
        open={showAddLocalDialog}
        onClose={() => setShowAddLocalDialog(false)}
        propertyId={property._id}
        onLocalAdded={async () => {
          try {
            const updated = await refreshProperty(property._id);
            setProperty(updated);
          } catch (err) {
            console.error('Error al refrescar inmueble desde contexto:', err);
          }
        }}
      />


      <EditLocalModal
        open={showEditLocalDialog}
        onClose={() => setShowEditLocalDialog(false)}
        propertyId={property._id}
        local={property.locals[editLocalIndex]}
        index={editLocalIndex}
        onLocalUpdated={(updatedProperty) => {
          setProperty(updatedProperty);
        }}
      />

      <AlertDialog open={localToDeleteIndex !== null} onOpenChange={() => setLocalToDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea eliminar este local?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El local será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLocalToDeleteIndex(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                try {
                  await fetch(`${API_URL}/${property._id}/locals/${localToDeleteIndex}`, {
                    method: 'DELETE',
                  });

                  const response = await fetch(`${API_URL}/${property._id}`);
                  if (!response.ok) throw new Error('No se pudo obtener el inmueble actualizado');
                  const updatedProperty = await response.json();
                  setProperty(updatedProperty);

                  setLocalToDeleteIndex(null);
                } catch (error) {
                  console.error('Error al eliminar local:', error);
                  alert('No se pudo eliminar el local.');
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={!!pdfData.url} onOpenChange={() => setPdfData({ url: null, title: null })}>
        <DialogContent className="max-w-5xl w-full h-[90vh]">
          <iframe
            src={pdfData.url}
            title={pdfData.title || "PDF Viewer"}
            className="w-full h-full border-none"
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PropertyDetails;