import { createContext, useContext } from 'react';

const AssetContext = createContext(undefined);

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};

export default AssetContext;