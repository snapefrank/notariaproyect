import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const UserProfilePage = () => {
  const { user, updateUserInfo } = useAuth(); 
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: name,
        ...(password && { password }),
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, payload);
      setMessage('Datos actualizados correctamente');
      updateUserInfo({ ...user, name }); 
    } catch (err) {
      setMessage('Error al actualizar');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Nueva Contraseña</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit">Guardar cambios</Button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default UserProfilePage;
