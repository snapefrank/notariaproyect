import React from 'react';
import AssetCard from './AssetCard';

const PropertyList = ({ properties, onEdit, onDelete }) => {
  if (!Array.isArray(properties)) {
    return 
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <AssetCard
          key={property.id}
          asset={property}
          assetType="property"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PropertyList;
