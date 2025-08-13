import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/contexts/AssetContext';
import { useMoralPersons } from '@/contexts/MoralPersonContext';
import { usePhysicalPersons } from '@/contexts/PhysicalPersonContext';
import { useArtworks } from '@/contexts/ArtworkContext';
import { useAssociations } from '@/contexts/AssociationContext';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, UserCircle, Building, Landmark, Users, Palette, Briefcase, Home, FileText, Users2, Paintbrush, Archive } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import { useReminders } from '@/contexts/ReminderContext';




const NavLink = ({ to, children, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive
          ? 'bg-custom-silver text-custom-umber'
          : 'text-custom-gray hover:bg-custom-silver/50 hover:text-custom-umber'
        }`}
    >
      {children}
    </Link>
  );
};

const TopNavItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="text-xs sm:text-sm font-medium text-custom-gray hover:text-custom-umber transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-custom-silver/30"
  >
    {children}
  </button>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl = "/logo.png";
  const { reminders } = useReminders();
  const urgentCount = reminders.filter(r => r.severity === 'high').length;
  const [showReminders, setShowReminders] = useState(false);


  const { properties } = useAssets();
  const { moralPersons } = useMoralPersons();
  const { physicalPersons } = usePhysicalPersons();
  const { artworks } = useArtworks();
  const { associations } = useAssociations();

  const activeProperties = properties.filter(p => p.status === 'active');
  const soldProperties = properties.filter(p => p.status === 'sold');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-custom-silver bg-white shadow-sm">
      {/* Primera fila: Logo, Nombre, Resúmenes, Acciones Usuario */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Izquierda: Logo y Nombre */}
          <div className="flex items-center">
            <Link to={user?.role === 'owner' ? '/owner' : '/employee'} className="flex items-center">
              <img alt="Logo Notaría" className="h-10 w-auto mr-3" src={logoUrl} />
              <span className="font-semibold text-lg sm:text-xl text-custom-umber hidden sm:block">Notaría Digital</span>
            </Link>
          </div>

          {/* Centro: Resúmenes de Datos */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <TopNavItem>Inmuebles Activos: {activeProperties.length}</TopNavItem>
            <TopNavItem>Vendidos: {soldProperties.length}</TopNavItem>
            <TopNavItem>Asociaciones: {associations.length}</TopNavItem>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs sm:text-sm font-medium text-custom-gray hover:text-custom-umber transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-custom-silver/30">
                  Personas <Users className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>Morales: {moralPersons.length}</DropdownMenuItem>
                <DropdownMenuItem>Físicas: {physicalPersons.length}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TopNavItem>Piezas de Arte: {artworks.length}</TopNavItem>
          </nav>

          {/* Derecha: Acciones de Usuario */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowReminders(!showReminders)}
                className="relative p-2 rounded-full hover:bg-custom-silver/50 text-custom-gray hover:text-custom-umber"
              >
                <Bell className="h-5 w-5" />
                {urgentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {urgentCount}
                  </span>
                )}
              </button>

              {showReminders && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold mb-2 text-red-600">⚠️ Notificaciones Urgentes</h4>
                    {urgentCount === 0 ? (
                      <p className="text-sm text-gray-500">No hay recordatorios urgentes por vencer.</p>
                    ) : (
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {reminders.filter(r => r.severity === 'high').map((reminder, index) => (
                          <li key={index} className="text-sm text-red-700">
                            <div className="font-medium">• {reminder.title}</div>
                            <div className="text-xs text-gray-500">Vence: {reminder.dueDate}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-custom-gray hover:text-custom-umber hover:bg-custom-silver/50 px-1 sm:px-2">
                  <Avatar className="h-8 w-8 border border-custom-silver">
                    <AvatarImage src={null} alt={user?.name} />
                    <AvatarFallback className="bg-custom-gray text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/mi-perfil')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Mi Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:!text-red-600 hover:!bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Segunda fila: Navegación Principal */}
      <div className="bg-white border-b border-custom-silver">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto">
            <NavLink to="/dashboard" exact>
              <Home className="h-5 w-5 mr-2" />
              Inicio
            </NavLink>
            <NavLink to="/documents">
              <FileText className="h-5 w-5 mr-2" />
              Documentos
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-custom-gray hover:text-custom-umber hover:bg-custom-silver/30">
                  <Building className="h-5 w-5 mr-2" />
                  Inmuebles
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => navigate('/inmuebles-activos')}>
                  Inmuebles Activos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/inmuebles-vendidos')}>
                  Inmuebles Vendidos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-custom-gray hover:text-custom-umber hover:bg-custom-silver/30">
                  <Users2 className="h-5 w-5 mr-2" />
                  Personas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => navigate('/personas-fisicas')}>
                  Personas Físicas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/personas-morales')}>
                  Personas Morales
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink to="/artworks">
              <Paintbrush className="h-5 w-5 mr-2" />
              Piezas de Arte
            </NavLink>
            <NavLink to="/associations">
              <Landmark className="h-5 w-5 mr-2" />
              Asociaciones
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
