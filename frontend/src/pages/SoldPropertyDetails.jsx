import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssets } from '@/contexts/AssetContext';
import PropertyHeader from '@/components/propertyDetails/PropertyHeader';
import PropertyInformation from '@/components/propertyDetails/PropertyInformation';
import RelatedDocumentInfo from '@/components/propertyDetails/RelatedDocumentInfo';
import LoadingSpinner from '@/components/propertyDetails/LoadingSpinner';
import NotFoundMessage from '@/components/propertyDetails/NotFoundMessage';
import { Button } from '@/components/ui/button'; // ✅ Importar botón

const SoldPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = useAssets();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetched = properties.find(p => p.id === id && p.status === 'sold');
    setProperty(fetched || null);
    setLoading(false);
  }, [id, properties]);

  if (loading) return <LoadingSpinner />;
  if (!property) return <NotFoundMessage message="Inmueble vendido no encontrado" />;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ✅ Botón de regresar */}
      <Button variant="outline" onClick={() => navigate('/inmuebles-vendidos')}>
        ← Regresar
      </Button>

      <PropertyHeader property={property} />
      <PropertyInformation property={property} />
      <RelatedDocumentInfo property={property} />
    </div>
  );
};

export default SoldPropertyDetails;
