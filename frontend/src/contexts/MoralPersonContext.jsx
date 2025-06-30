import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const MoralPersonContext = createContext();

export const useMoralPersons = () => useContext(MoralPersonContext);

export const MoralPersonProvider = ({ children }) => {
  const [moralPersons, setMoralPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoralPersons = async () => {
      try {
        const response = await axios.get('/api/moral-persons');
        setMoralPersons(response.data);
      } catch (error) {
        console.error('Error al cargar personas morales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoralPersons();
  }, []);

  // ✅ Nueva función: obtiene directamente desde el backend por ID
  const fetchMoralPersonById = async (id) => {
    try {
      const response = await axios.get(`/api/moral-persons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener persona moral por ID:', error);
      return null;
    }
  };

  const getMoralPersonById = (id) => {
    return moralPersons.find(person => person._id === id);
  };

  const addMoralPerson = async (person) => {
    try {
      const response = await axios.post('/api/moral-persons', person);
      setMoralPersons(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error al agregar persona moral:', error);
    }
  };

  const updateMoralPerson = async (id, updatedPerson) => {
    try {
      const response = await axios.put(`/api/moral-persons/${id}`, updatedPerson);
      setMoralPersons(prev =>
        prev.map(person =>
          person._id === id ? response.data : person
        )
      );
    } catch (error) {
      console.error('Error al actualizar persona moral:', error);
    }
  };

  const deleteMoralPerson = async (id) => {
    try {
      await axios.delete(`/api/moral-persons/${id}`);
      setMoralPersons(prev =>
        prev.filter(person => person._id !== id)
      );
    } catch (error) {
      console.error('Error al eliminar persona moral:', error);
    }
  };

  return (
    <MoralPersonContext.Provider
      value={{
        moralPersons,
        getMoralPersonById,
        fetchMoralPersonById, // ✅ agregado
        addMoralPerson,
        updateMoralPerson,
        deleteMoralPerson,
        loading,
      }}
    >
      {children}
    </MoralPersonContext.Provider>
  );
};
