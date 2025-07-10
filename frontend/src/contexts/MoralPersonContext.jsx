import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/api/moral-persons';

const MoralPersonContext = createContext();

export const useMoralPersons = () => useContext(MoralPersonContext);

export const MoralPersonProvider = ({ children }) => {
  const [moralPersons, setMoralPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoralPersons();
  }, []);

  const fetchMoralPersons = async () => {
    try {
      const response = await axios.get(API_URL);
      setMoralPersons(response.data);
    } catch (error) {
      console.error('Error al cargar personas morales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoralPersonById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener persona moral por ID:', error);
      return null;
    }
  };

  const getMoralPersonById = (id) => {
    return moralPersons.find((person) => person._id === id);
  };

  const addMoralPerson = async (person) => {
    try {
      const isFormData = person instanceof FormData;

      const response = await axios.post(API_URL, person, {
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      });

      setMoralPersons((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error al agregar persona moral:', error);
    }
  };

  const updateMoralPerson = async (id, updatedPerson) => {
    try {
      const isFormData = updatedPerson instanceof FormData;

      const response = await axios.put(`${API_URL}/${id}`, updatedPerson, {
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      });

      setMoralPersons((prev) =>
        prev.map((person) =>
          person._id === id ? response.data : person
        )
      );
    } catch (error) {
      console.error('Error al actualizar persona moral:', error);
    }
  };

  const deleteMoralPerson = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMoralPersons((prev) => prev.filter((person) => person._id !== id));
    } catch (error) {
      console.error('Error al eliminar persona moral:', error);
    }
  };

  return (
    <MoralPersonContext.Provider
      value={{
        moralPersons,
        getMoralPersonById,
        fetchMoralPersonById,
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
