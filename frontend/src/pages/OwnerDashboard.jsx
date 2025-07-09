import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Package,
  BarChart,
  Users,
  TrendingUp,
  DollarSign,
  Home,
  Palette,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/contexts/DocumentContext';


// Importaciones para el modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

// Importaciones condicionales para los contextos
let useAssets, useArtworks, useAssociations, useMoralPersons, usePhysicalPersons;

try {
  useAssets = require('@/contexts/AssetContext').useAssets;
} catch {
  useAssets = () => ({ properties: [], artworks: [], otherAssets: [] });
}

try {
  useArtworks = require('@/contexts/ArtworkContext').useArtworks;
} catch {
  useArtworks = () => ({ artworks: [] });
}

try {
  useAssociations = require('@/contexts/AssociationContext').useAssociations;
} catch {
  useAssociations = () => ({ associations: [] });
}

try {
  useMoralPersons = require('@/contexts/MoralPersonContext').useMoralPersons;
} catch {
  useMoralPersons = () => ({ moralPersons: [] });
}

try {
  usePhysicalPersons = require('@/contexts/PhysicalPersonContext').usePhysicalPersons;
} catch {
  usePhysicalPersons = () => ({ physicalPersons: [] });
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { documents = [] } = useDocuments();
  const [assetSummary, setAssetSummary] = useState(null);



  useEffect(() => {
    const fetchAssetSummary = async () => {
      try {
        const response = await fetch(`${apiBase}/api/assets/summary`);
        const data = await response.json();
        console.log("📦 Asset summary cargado:", data);
        setAssetSummary(data);
      } catch (error) {
        console.error('❌ Error al obtener el resumen de activos:', error);
      }
    };

    fetchAssetSummary();
  }, []);


  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para almacenar los datos que se mostrarán en el modal
  const [modalData, setModalData] = useState({
    title: '',
    description: '',
    content: null
  });

  // Usar los hooks con valores por defecto
  const assetData = useAssets();
  const artworkData = useArtworks();
  const associationData = useAssociations();
  const moralPersonData = useMoralPersons();
  const physicalPersonData = usePhysicalPersons();

  const properties = assetData?.properties || [];
  const artworks = assetData?.artworks || artworkData?.artworks || [];
  const otherAssets = assetData?.otherAssets || [];
  const associations = associationData?.associations || [];
  const moralPersons = moralPersonData?.moralPersons || [];
  const physicalPersons = physicalPersonData?.physicalPersons || [];

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Función helper para convertir valores a número seguro
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Función helper para formatear números
  const formatCurrency = (value) => {
    const num = safeNumber(value);
    return num.toLocaleString();
  };

  // Cálculos de métricas
  const metrics = useMemo(() => {
    const activeProperties = properties.filter(p => p.status === 'active');
    const soldProperties = properties.filter(p => p.status === 'sold');
    const totalPropertyValue = assetSummary?.properties?.total ?? properties.reduce((sum, prop) => sum + safeNumber(prop.valor_total), 0);
    const totalArtworkValue = assetSummary?.artworks?.total ?? artworks.reduce((sum, art) => sum + safeNumber(art.value), 0);
    const totalOtherValue = assetSummary?.otherAssets?.total ?? otherAssets.reduce((sum, asset) => sum + safeNumber(asset.value), 0);
    const totalValue = totalPropertyValue + totalArtworkValue + totalOtherValue;

    // Calcular ingresos por rentas
    const monthlyRentIncome = properties.reduce((sum, prop) => {
      if (prop.locals && Array.isArray(prop.locals)) {
        return sum + prop.locals.reduce((localSum, local) => {
          return localSum + safeNumber(local.rentCost);
        }, 0);
      }
      return sum;
    }, 0);

    // Documentos recientes (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDocuments = documents.filter(doc => {
      try {
        return new Date(doc.createdAt) > thirtyDaysAgo;
      } catch {
        return false;
      }
    }).length;

    // Calcular ocupación de locales
    const totalLocals = properties.reduce((sum, prop) => {
      return sum + (Array.isArray(prop.locals) ? prop.locals.length : 0);
    }, 0);

    const occupiedLocals = properties.reduce((sum, prop) => {
      if (!Array.isArray(prop.locals)) return sum;
      return sum + prop.locals.filter(local => local.isOccupied).length;
    }, 0);

    const occupancyRate = totalLocals > 0 ? (occupiedLocals / totalLocals) * 100 : 0;

    return {
      totalAssets: properties.length + artworks.length + otherAssets.length,
      totalDocuments: documents.length,
      totalValue,
      activeProperties: activeProperties.length,
      soldProperties: soldProperties.length,
      monthlyRentIncome,
      totalAssociations: associations.length,
      totalPersons: moralPersons.length + physicalPersons.length,
      recentDocuments,
      propertyValue: totalPropertyValue,
      artworkValue: totalArtworkValue,
      otherValue: totalOtherValue,
      occupancyRate,
      totalLocals,
      occupiedLocals
    };
  }, [properties, artworks, otherAssets, documents, associations, moralPersons, physicalPersons]);

  // Estadísticas principales
  const mainStats = [
    {
      title: 'Valor Total de Activos',
      value: `${formatCurrency(metrics.totalValue)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Ingresos Mensuales por Rentass',
      value: `${formatCurrency(metrics.monthlyRentIncome)}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Tasa de Ocupación',
      value: `${metrics.occupancyRate.toFixed(1)}%`,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: `${metrics.occupiedLocals}/${metrics.totalLocals} locales`,
      changeType: 'neutral'
    },
    {
      title: 'Documentos Recientes',
      value: metrics.recentDocuments,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Últimos 30 días',
      changeType: 'neutral'
    },
  ];

  // Distribución de activos
  const assetDistribution = [
    {
      name: 'Inmuebles',
      value: metrics.propertyValue,
      count: properties.length,
      color: 'bg-blue-500'
    },
    {
      name: 'Obras de Arte',
      value: metrics.artworkValue,
      count: artworks.length,
      color: 'bg-purple-500'
    },
    {
      name: 'Otros Activos',
      value: metrics.otherValue,
      count: otherAssets.length,
      color: 'bg-green-500'
    }
  ];

  // Imágenes para el carrusel - con datos de ejemplo si no hay datos reales
  const artworkImages = artworks.flatMap(art =>
    (art.photoPaths || []).map(p => ({
      src: `${apiBase}/uploads/artworks/photos/${p}`,
      title: art.title,
      type: 'Obra de Arte',
      value: safeNumber(art.value)
    }))
  );

  const propertyImages = properties.flatMap(prop =>
    (prop.photos || []).map(p => ({
      src: `${apiBase}/uploads/properties/photos/${p}`,
      title: prop.name,
      type: 'Inmueble',
      value: safeNumber(prop.value)
    }))
  );

  // Imágenes de ejemplo si no hay datos reales
  const exampleImages = [
    {
      src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      title: 'Casa Moderna',
      type: 'Inmueble',
      value: 2500000
    },
    {
      src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      title: 'Pintura Abstracta',
      type: 'Obra de Arte',
      value: 150000
    },
    {
      src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      title: 'Apartamento Lujoso',
      type: 'Inmueble',
      value: 3200000
    },
    {
      src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      title: 'Casa Contemporánea',
      type: 'Inmueble',
      value: 2800000
    },
    {
      src: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
      title: 'Edificio Residencial',
      type: 'Inmueble',
      value: 5200000
    },
    {
      src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      title: 'Apartamento Lujoso',
      type: 'Inmueble',
      value: 3200000
    },
    {
      src: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
      title: 'Torre de Oficinas',
      type: 'Inmueble',
      value: 4500000
    },
    {
      src: 'http://localhost:5000/uploads/artworks/photos/Fernando-Botero-Mona-Lisa-1978-183-x-166-cm_1751288538976.jpg',
      title: 'Torre de Oficinas',
      type: 'Inmueble',
      value: 4500000
    },
    {
      src: 'http://localhost:5000/uploads/artworks/photos/R_1751288538946.png',
      title: 'Torre de Oficinas',
      type: 'Inmueble',
      value: 4500000
    },
  ];

  const allImages = [...artworkImages, ...propertyImages].length > 0 ? [...artworkImages, ...propertyImages] : exampleImages;

  // Datos de rendimiento mensual (simulados)
  const monthlyPerformance = [
    { month: 'Ene', income: 45000, expenses: 12000 },
    { month: 'Feb', income: 48000, expenses: 13000 },
    { month: 'Mar', income: 52000, expenses: 11000 },
    { month: 'Abr', income: 49000, expenses: 14000 },
    { month: 'May', income: 55000, expenses: 12500 },
    { month: 'Jun', income: 58000, expenses: 13500 }
  ];

  // Función para abrir el modal con datos específicos
  const openDetailModal = (statType) => {
    let title = '';
    let description = '';
    let content = null;

    switch (statType) {
      case 'totalAssets':
        title = 'Desglose de Valor Total de Activos';
        description = 'Detalle de todos los activos por categoría y propietario';
        content = (
          <div className="space-y-6">
            {/* Sección de Inmuebles */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Inmuebles (${formatCurrency(metrics.propertyValue)})</h3>
              <div className="space-y-3">
                {properties.length > 0 ? (
                  properties.map((prop, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{prop.name || `Propiedad ${idx + 1}`}</span>
                        <span className="font-semibold">${formatCurrency(prop.valor_total)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {getOwnerName(prop.propietario)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>Franklin Diaz — 1 inmueble — $1,000.00</p>
                    <p>Ana Mendoza — 1 inmueble — $0.00</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Obras de Arte */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Obras de Arte (${formatCurrency(metrics.artworkValue)})</h3>
              <div className="space-y-3">
                {artworks.length > 0 ? (
                  artworks.map((art, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{art.title || `Obra ${idx + 1}`}</span>
                        <span className="font-semibold">${formatCurrency(art.value)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {art.artist || 'Artista desconocido'} • {art.year || 'Año no especificado'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>Franklin Diaz — 1 obra de arte — $3,600.00</p>
                  </div>

                )}
              </div>
            </div>

            {/* Sección de Otros Activos */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Otros Activos (${formatCurrency(metrics.otherValue)})</h3>
              <div className="space-y-3">
                {otherAssets.length > 0 ? (
                  otherAssets.map((asset, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{asset.name || `Activo ${idx + 1}`}</span>
                        <span className="font-semibold">${formatCurrency(asset.value)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {asset.type || 'Tipo no especificado'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No hay otros activos registrados.</p>
                )}
              </div>
            </div>
          </div>
        );
        break;

      case 'monthlyRent':
        title = 'Desglose de Ingresos Mensuales por Renta';
        description = 'Detalle de todos los ingresos por renta de inmuebles';
        content = (
          <div className="space-y-6">
            {properties.filter(p => p.locals && p.locals.length > 0).length > 0 ? (
              properties.filter(p => p.locals && p.locals.length > 0).map((prop, idx) => (
                <div key={idx} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold mb-2">{prop.name || `Propiedad ${idx + 1}`}</h3>
                  <div className="space-y-3">
                    {prop.locals.map((local, localIdx) => (
                      <div key={localIdx} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">Local {localIdx + 1}</span>
                          <span className="font-semibold">${formatCurrency(local.rentCost)}/mes</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Arrendatario: {local.tenant || 'No especificado'} •
                          Área: {local.rentedArea || 'No especificada'} m²
                        </div>
                        <div className="text-sm text-gray-500">
                          Contrato: {local.rentStartDate ? local.rentStartDate.substring(0, 10) : 'No especificado'} -
                          {local.rentEndDate ? local.rentEndDate.substring(0, 10) : 'No especificado'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay locales rentados registrados.</p>
            )}
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total de ingresos mensuales:</span>
                <span className="text-xl font-bold text-blue-600">${formatCurrency(metrics.monthlyRentIncome)}</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'occupancyRate':
        title = 'Desglose de Tasa de Ocupación';
        description = 'Detalle de ocupación de locales por inmueble';
        content = (
          <div className="space-y-6">
            {properties.filter(p => p.locals && p.locals.length > 0).length > 0 ? (
              properties.filter(p => p.locals && p.locals.length > 0).map((prop, idx) => {
                const totalLocalsInProp = prop.locals.length;
                const occupiedLocalsInProp = prop.locals.filter(local => local.isOccupied).length;
                const occupancyRateInProp = totalLocalsInProp > 0 ? (occupiedLocalsInProp / totalLocalsInProp) * 100 : 0;

                return (
                  <div key={idx} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{prop.name || `Propiedad ${idx + 1}`}</h3>
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {occupancyRateInProp.toFixed(1)}% ocupado
                      </span>
                    </div>
                    <div className="space-y-3">
                      {prop.locals.map((local, localIdx) => (
                        <div key={localIdx} className={`p-3 ${local.isOccupied ? 'bg-green-50' : 'bg-gray-50'} rounded-md`}>
                          <div className="flex justify-between">
                            <span className="font-medium">Local {localIdx + 1}</span>
                            <span className={`font-medium ${local.isOccupied ? 'text-green-600' : 'text-gray-500'}`}>
                              {local.isOccupied ? 'Ocupado' : 'Disponible'}
                            </span>
                          </div>
                          {local.isOccupied && (
                            <div className="text-sm text-gray-500 mt-1">
                              Arrendatario: {local.tenant || 'No especificado'} •
                              Renta: ${formatCurrency(local.rentCost)}/mes
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No hay locales registrados.</p>
            )}
            <div className="mt-4 p-4 bg-purple-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Tasa de ocupación global:</span>
                <span className="text-xl font-bold text-purple-600">{metrics.occupancyRate.toFixed(1)}%</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {metrics.occupiedLocals} de {metrics.totalLocals} locales ocupados
              </div>
            </div>
          </div>
        );
        break;

      case 'recentDocuments':
        title = 'Documentos Recientes';
        description = 'Documentos creados en los últimos 30 días';

        // Filtrar documentos recientes (últimos 30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentDocs = documents.filter(doc => {
          try {
            return new Date(doc.createdAt) > thirtyDaysAgo;
          } catch {
            return false;
          }
        });

        content = (
          <div className="space-y-4">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium">{doc.title || `Documento ${idx + 1}`}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {doc.category || 'Sin categoría'} • {doc.type || 'Sin tipo'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay documentos recientes.</p>
            )}
          </div>
        );
        break;

      default:
        title = 'Detalles';
        description = 'Información detallada';
        content = <p>No hay información disponible.</p>;
    }

    setModalData({ title, description, content });
    setShowModal(true);
  };

  // Modificar el renderizado de las tarjetas de estadísticas para hacerlas clickeables
  const renderMainStats = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {mainStats.map((stat, index) => (
        <motion.div key={stat.title} variants={itemVariants}>
          <Card
            className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              // Determinar qué modal abrir según el índice
              const statTypes = ['totalAssets', 'monthlyRent', 'occupancyRate', 'recentDocuments'];
              openDetailModal(statTypes[index]);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
  const getOwnerName = (ownerId) => {
    const person = physicalPersons.find(p => p._id === ownerId) || moralPersons.find(p => p._id === ownerId);
    return person ? (person.nombre || `${person.nombres} ${person.apellidoPaterno || ''}`.trim()) : 'Propietario no especificado';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-custom-umber">Panel de Control</h1>
          <p className="text-custom-gray mt-1">
            Resumen ejecutivo de todos sus activos y operaciones
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-custom-gray">
          <span>Última actualización: {new Date().toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* Estadísticas Principales */}
      {renderMainStats()}

      {/* Fila de gráficos y distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Activos */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Distribución de Activos
              </CardTitle>
              <CardDescription>
                Valor y cantidad por categoría
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assetDistribution.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">${item.value.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{item.count} elementos</div>
                    </div>
                  </div>
                  <Progress
                    value={(item.value / metrics.totalValue) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumen de Entidades */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Resumen de Entidades
              </CardTitle>
              <CardDescription>
                Personas y asociaciones registradas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{physicalPersons.length}</div>
                  <div className="text-sm text-blue-600">Personas Físicas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{moralPersons.length}</div>
                  <div className="text-sm text-purple-600">Personas Morales</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{associations.length}</div>
                  <div className="text-sm text-green-600">Asociaciones</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{metrics.totalDocuments}</div>
                  <div className="text-sm text-orange-600">Documentos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Galería de Activos */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Galería de Activos
            </CardTitle>
            <CardDescription>
              Vista previa de inmuebles y obras de arte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allImages.length > 0 ? (
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={true}
                loop={true}
                spaceBetween={20}
                slidesPerView={3}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 }
                }}
              >
                {allImages.map((image, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={image.src}
                      alt={`${image.type} ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-md shadow-md"
                    />
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{image.title}</p>
                      <p className="text-xs text-gray-500">${image.value.toLocaleString()}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-custom-gray">No hay imágenes disponibles de obras ni inmuebles.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de detalles */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalData.title}</DialogTitle>
            <DialogDescription>{modalData.description}</DialogDescription>
          </DialogHeader>
          {modalData.content}
          <DialogClose className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerDashboard;