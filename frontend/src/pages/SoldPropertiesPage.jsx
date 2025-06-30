import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useAssets } from '@/contexts/AssetContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AssetCard from '@/components/AssetCard';
import SearchBar from '@/components/SearchBar';

const SoldPropertiesPage = () => {
  const { properties } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const filteredProperties = () => {
    let filtered = properties.filter(p => p.status === 'sold');

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
          <h1 className="text-3xl font-bold">Inmuebles Vendidos</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza todos los inmuebles marcados como vendidos.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} placeholder="Buscar inmuebles vendidos..." />
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
              // No se permite editar ni eliminar aquí
              onEdit={null}
              onDelete={null}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No se encontraron inmuebles vendidos</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? 'No hay resultados para su búsqueda.' : 'No hay inmuebles con estado "vendido".'}
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
    </div>
  );
};

export default SoldPropertiesPage;
