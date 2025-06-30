import React, { useState, useEffect } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Define permisos por rol
const ROLES_PERMISSIONS = {
  owner: ['view_all_data'],
  employee: ['manage_documents', 'manage_assets', 'upload_files', 'delete_files', 'edit_data'],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar usuario desde localStorage al inicio
  useEffect(() => {
    const storedUser = localStorage.getItem('notaria_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('notaria_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Nuevo login conectado al backend
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error de autenticación",
          description: errorData.message || "Credenciales incorrectas",
          variant: "destructive",
        });
        return false;
      }

      const data = await response.json();

      const safeUser = {
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        role: data.user.role,
        permissions: ROLES_PERMISSIONS[data.user.role] || [],
        token: data.token, // Token JWT
      };

      setUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('notaria_user', JSON.stringify(safeUser));

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${safeUser.name}`,
        variant: "default",
        className: "bg-custom-gray text-white"
      });

      return true;

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('notaria_user');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
      className: "bg-custom-gray text-white"
    });
  };

  const canPerformAction = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    canPerformAction
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
