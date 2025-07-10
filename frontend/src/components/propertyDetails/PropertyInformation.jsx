import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { apiBase } from '@/lib/constants';



const PropertyInformation = ({ property }) => {
  console.log("✅ PROPERTY COMPLETA:", property);
  const {
    name,
    propietario,
    usufruct,
    deedNumber,
    deedDate,
    deedFileUrl,
    notary,
    cadastralKey,
    location,
    totalArea,
    hasEncumbrance,
    encumbranceInstitution,
    encumbranceAmount,
    encumbranceDate,
    isRented,
    tenant,
    rentedArea,
    rentCost,
    rentStart,
    rentEnd,
    rentContractUrl,
    extraDocs = [],
    photos = [],
  } = property;

  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const [selectedImage, setSelectedImage] = useState(null);
  const [pdfData, setPdfData] = useState({ url: null, title: null });
  const ownerName = typeof owner === 'object'
    ? owner.nombre || owner.name || 'Propietario no identificado'
    : 'No especificado';


  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Inmueble</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Nombre de la Propiedad" value={name} />
          <Info
            label="Propietario"
            value={
              propietario
                ? `${propietario.nombres} ${propietario.apellidoPaterno} ${propietario.apellidoMaterno}`
                : 'No especificado'
            }
          />
          <Info
            label="Valor Total del Inmueble"
            value={property.valor_total
              ? Number(property.valor_total).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })
              : 'No especificado'}
          />


          <Info label="Usufructo" value={usufruct} />
          <Info label="Número de Escritura" value={deedNumber} />
          <Info label="Fecha de Escritura" value={deedDate && new Date(deedDate).toLocaleDateString()} />
          <Info label="Notaría" value={notary} />
          <Info label="Clave Catastral" value={cadastralKey} />
          <Info label="Ubicación" value={location} />
          <Info label="Superficie Total" value={`${totalArea} m²`} />
          <Info label="¿Cuenta con Gravamen?" value={hasEncumbrance ? 'Sí' : 'No'} />
        </div>

        {hasEncumbrance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <Info label="Institución del Gravamen" value={encumbranceInstitution} />
            <Info label="Monto del Gravamen" value={`$${Number(encumbranceAmount).toLocaleString()}`} />
            <Info label="Fecha del Gravamen" value={encumbranceDate && new Date(encumbranceDate).toLocaleDateString()} />
          </div>
        )}

        {isRented && (
          <div className="pt-6 border-t space-y-2">
            <h3 className="text-base font-semibold">Información de Renta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Arrendatario" value={tenant} />
              <Info label="Superficie rentada" value={`${rentedArea} m²`} />
              <Info label="Costo mensual" value={`$${rentCost}`} />
              <Info
                label="Inicio de renta"
                value={
                  rentStart
                    ? new Date(rentStart).toLocaleDateString('es-MX', { dateStyle: 'medium' })
                    : 'No especificado'
                }
              />
              <Info
                label="Fin de renta"
                value={
                  rentEnd
                    ? new Date(rentEnd).toLocaleDateString('es-MX', { dateStyle: 'medium' })
                    : 'No especificado'
                }
              />
            </div>
          </div>
        )}

        {(deedFileUrl || rentContractUrl || extraDocs.length > 0) && (
          <div className="pt-6 border-t space-y-3">
            <h3 className="text-base font-semibold">Documentos</h3>
            {deedFileUrl && (
              <DocumentItem
                label="Escritura"
                fileUrl={`${apiBase}/uploads/properties/deeds/${deedFileUrl}`}
                onView={setPdfData}
              />
            )}
            {isRented && rentContractUrl && (
              <DocumentItem
                label="Contrato de Arrendamiento"
                fileUrl={`${apiBase}/uploads/properties/rent-contracts/${rentContractUrl}`}
                onView={setPdfData}
              />
            )}
            {extraDocs.map((filename, idx) => (
              <DocumentItem
                key={idx}
                label={`Documento Adicional ${idx + 1}`}
                fileUrl={`${apiBase}/uploads/properties/extra-docs/${filename}`}
                onView={setPdfData}
              />
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-base font-semibold mb-2">Fotos del Inmueble</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map((filename, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(`${apiBase}/uploads/properties/photos/${filename}`)}
                  className="focus:outline-none"
                >
                  <img
                    src={`${apiBase}/uploads/properties/photos/${filename}`}
                    alt={`Foto ${index + 1}`}
                    className="rounded-md w-full h-32 object-cover shadow-sm hover:ring-2 hover:ring-blue-500"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={!!pdfData.url} onOpenChange={() => setPdfData({ url: null, title: null })}>
        <DialogContent className="max-w-5xl w-full h-[90vh]">
          <iframe
            src={pdfData.url}
            title={pdfData.title || "PDF Viewer"}
            className="w-full h-full border-none"
          ></iframe>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Vista ampliada del inmueble"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </Card>
  );
};

const Info = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-md">
    <p className="text-muted-foreground mb-1">{label}</p>
    <p className="font-medium">{value || 'No especificado'}</p>
  </div>
);

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
        a.download = label || 'documento'; // Usa el label como nombre de archivo o 'documento' por defecto
        a.target = '_blank'; // Asegura que no se abra en la misma ventana
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

export default PropertyInformation;