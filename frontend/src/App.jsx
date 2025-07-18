import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TaskContextProvider } from '@/contexts/TaskContext'; // ✅ Contexto tareas

// Layouts
import MainLayout from '@/layouts/MainLayout';

// Pages
import Login from '@/pages/Login';
import OwnerDashboard from '@/pages/OwnerDashboard';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import DocumentsPage from '@/pages/DocumentsPage';
import DocumentDetails from '@/pages/DocumentDetails';
import PropertiesPage from '@/pages/PropertiesPage';
import SoldPropertiesPage from '@/pages/SoldPropertiesPage';
import ArtworksPage from '@/pages/ArtworksPage';
import OtherAssetsPage from '@/pages/OtherAssetsPage';
import NotFound from '@/pages/NotFound';
import PropertyDetails from '@/pages/PropertyDetails';
import PhysicalPersonsPage from '@/pages/PhysicalPersonsPage';
import MoralPersonsPage from '@/pages/MoralPersonsPage';
import MoralPersonDetails from '@/pages/MoralPersonDetails';
import AssociationsPage from '@/pages/AssociationsPage';
import SoldPropertyDetails from '@/pages/SoldPropertyDetails';
import PhysicalPersonDetails from '@/pages/PhysicalPersonDetails';
import AssociationDetails from '@/pages/AssociationDetails';
import UserProfilePage from '@/pages/UserProfilePage';


// Placeholder
const PlaceholderPage = ({ title }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-custom-umber">{title}</h1>
    <p className="text-custom-gray">Contenido para {title} estará disponible pronto.</p>
  </div>
);

// Ruta protegida
const ProtectedRoute = ({ children, allowedRoles, requiredPermissions = [] }) => {
  const { user, isAuthenticated, canPerformAction } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/employee'} replace />;
  }
  if (requiredPermissions.length > 0) {
    const hasAll = requiredPermissions.every(p => canPerformAction(p));
    if (!hasAll) {
      return <Navigate to={user.role === 'owner' ? '/owner' : '/employee'} replace />;
    }
  }
  return children;
};

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const { isAuthenticated, user } = useAuth();

  const defaultAuthenticatedPath = isAuthenticated
    ? (user.role === 'owner' ? '/owner' : '/employee')
    : '/login';

  return (
    <TaskContextProvider>
      <Routes location={backgroundLocation || location}>
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to={defaultAuthenticatedPath} replace />
            : <Login />
        } />

        <Route path="/" element={<Navigate to={defaultAuthenticatedPath} replace />} />

        {/* Dashboards */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <MainLayout><OwnerDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MainLayout><EmployeeDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout>
              {user?.role === 'owner' ? <OwnerDashboard /> : <EmployeeDashboard />}
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Documentos */}
        <Route path="/documents" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><DocumentsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/documents/:id" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><DocumentDetails /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Inmuebles */}
        <Route path="/properties" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PropertiesPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/properties/:id" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PropertyDetails /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/inmuebles-activos/*" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PropertiesPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/inmuebles-vendidos" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><SoldPropertiesPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/inmuebles-vendidos/:id" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><SoldPropertyDetails /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Obras de arte */}
        <Route path="/artworks/*" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><ArtworksPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/other-assets" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><OtherAssetsPage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Placeholders */}
        <Route path="/properties-summary" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PlaceholderPage title="Resumen de Inmuebles" /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/associations-summary" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PlaceholderPage title="Resumen de Asociaciones" /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/people-summary" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PlaceholderPage title="Resumen de Personas" /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/artworks-summary" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PlaceholderPage title="Resumen de Piezas de Arte" /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Personas físicas */}
        <Route path="/personas-fisicas" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PhysicalPersonsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/personas-fisicas/:id" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><PhysicalPersonDetails /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Personas morales */}
        <Route path="/personas-morales" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><MoralPersonsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/personas-morales/:id" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><MoralPersonDetails /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Asociaciones */}
        <Route path="/associations" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><AssociationsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/associations/:id" element={
          <ProtectedRoute allowedRoles={['owner', 'employee']}>
            <MainLayout><AssociationDetails /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/mi-perfil" element={<UserProfilePage />} />
        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          {/* Ejemplo para modales, si los usas */}
        </Routes>
      )}
    </TaskContextProvider>
  );
};

export default App;
