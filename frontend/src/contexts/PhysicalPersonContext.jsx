import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL + '/api/physical-persons';

const PhysicalPersonContext = createContext();

export const usePhysicalPersons = () => {
  return useContext(PhysicalPersonContext);
};

export const PhysicalPersonProvider = ({ children }) => {
  const [physicalPersons, setPhysicalPersons] = useState([]);
  const { toast } = useToast();


  useEffect(() => {
    fetchAllPhysicalPersons();
  }, []);

  const fetchAllPhysicalPersons = async () => {
    try {
      const response = await axios.get(API_URL);
      setPhysicalPersons(response.data); // Asegúrate que aquí venga también "documents"
    } catch (error) {
      console.error('Error fetching physical persons:', error);
    }
  };

  const addPhysicalPerson = async (person) => {
    try {
      const response = await axios.post(API_URL, person, {
        headers: person instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' }
      });

      setPhysicalPersons((prev) => [...prev, response.data]);

      toast({
        title: 'Persona creada',
        description: 'La persona física ha sido registrada exitosamente.',
      });

      return response.data;
    } catch (error) {
      console.error('Error adding physical person:', error);
      toast({
        title: 'Error',
        description: 'No se pudo registrar la persona física.',
        variant: 'destructive',
      });
    }
  };



  const updatePhysicalPerson = async (id, updatedPerson) => {
    try {
      const isFormData = updatedPerson instanceof FormData;

      const response = await axios.put(`${API_URL}/${id}`, updatedPerson, {
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      });

      setPhysicalPersons((prev) =>
        prev.map((person) =>
          person._id === id || person.id === id ? response.data : person
        )
      );

      toast({
        title: 'Persona actualizada',
        description: 'Los datos de la persona fueron actualizados correctamente.',
      });

    } catch (error) {
      console.error('Error updating physical person:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la persona física.',
        variant: 'destructive',
      });
      throw error;
    }
  };


  const deletePhysicalPerson = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPhysicalPersons((prev) => prev.filter((person) => person._id !== id));

      toast({
        title: 'Persona eliminada',
        description: 'La persona física ha sido eliminada del sistema.',
        variant: 'destructive',
      });

    } catch (error) {
      console.error('Error deleting physical person:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la persona física.',
        variant: 'destructive',
      });
    }
  };

const getPhysicalPersonById = (id) => {
  return physicalPersons.find(
    (person) => person._id === id || person.id === id
  );
};


  return (
    <PhysicalPersonContext.Provider
      value={{
        physicalPersons,
        addPhysicalPerson,
        updatePhysicalPerson,
        deletePhysicalPerson,
        getPhysicalPersonById,
        fetchAllPhysicalPersons
      }}
    >
      {children}
    </PhysicalPersonContext.Provider>
  );
};