import React from 'react';
import PropertyForm from './PropertyForm';
import ArtworkForm from './ArtworkForm';
//import OtherAssetForm from './OtherAssetForm';

const AssetForm = ({ type, initialData, onSubmit, onCancel }) => {
  if (type === 'property') {
    return (
      <PropertyForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  if (type === 'artwork') {
    return (
      <ArtworkForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  if (type === 'other') {
    return (
      <OtherAssetForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  return null;
};

export default AssetForm;
