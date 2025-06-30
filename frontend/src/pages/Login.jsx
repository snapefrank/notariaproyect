import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/90f9b128-8767-4a3a-9236-41e435352062/d0251411dd7004bdf40efa49621e0612.png";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        // Navigation will be handled by App.jsx ProtectedRoute logic
      }
    } catch (error) {
      console.error('Login error:', error);
      // Toast for error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom-alabaster p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-custom-silver">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center justify-center text-center mb-8">
              <div className="mb-6">
                <img alt="Logo Notaría Login" className="h-20 w-auto" src={logoUrl} />
              </div>
              <h1 className="text-3xl font-bold text-custom-umber">Notaría Digital</h1>
              <p className="text-custom-gray mt-2">Acceso al sistema de gestión documental.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-custom-gray font-medium">Usuario</Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Su nombre de usuario"
                    required
                    className="pl-10 py-3 text-custom-umber border-custom-battleship-gray focus:border-custom-gray focus:ring-custom-gray"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-custom-battleship-gray" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-custom-gray font-medium">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Su contraseña"
                    required
                    className="pl-10 py-3 text-custom-umber border-custom-battleship-gray focus:border-custom-gray focus:ring-custom-gray"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-custom-battleship-gray" />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-custom-umber hover:bg-custom-umber/90 text-white py-3 text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </div>
        </div>
        <p className="text-center text-xs text-custom-battleship-gray mt-6">
          © {new Date().getFullYear()} Lomelí Luque Notaría. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;