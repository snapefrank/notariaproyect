import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/AuthContextProvider';
import { DocumentProvider } from '@/contexts/DocumentContextProvider';
import { AssetProvider } from '@/contexts/AssetContextProvider';
import { Toaster } from '@/components/ui/toaster';
import { PhysicalPersonProvider } from '@/contexts/PhysicalPersonContext';
import { MoralPersonProvider } from '@/contexts/MoralPersonContext';
import { ArtworkProvider } from '@/contexts/ArtworkContext';
import { AssociationProvider } from './contexts/AssociationContext';
import 'leaflet/dist/leaflet.css';
import { ReminderProvider } from './contexts/ReminderContext';

// Importa otros contextos si es necesario

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AssetProvider>
          <DocumentProvider>
            <PhysicalPersonProvider>
              <MoralPersonProvider>
                <ArtworkProvider>
                  <AssociationProvider>
                    <ReminderProvider>
                    <App />
                    <Toaster />
                    </ReminderProvider>
                  </AssociationProvider>
                </ArtworkProvider>
              </MoralPersonProvider>
            </PhysicalPersonProvider>
          </DocumentProvider>
        </AssetProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
  
);
