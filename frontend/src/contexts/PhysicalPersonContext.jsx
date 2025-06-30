import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PhysicalPersonContext = createContext();

export const usePhysicalPersons = () => {
  return useContext(PhysicalPersonContext);
};

export const PhysicalPersonProvider = ({ children }) => {
  const [physicalPersons, setPhysicalPersons] = useState([]);

  useEffect(() => {
    fetchPhysicalPersons();
  }, []);

  const fetchPhysicalPersons = async () => {
    try {
      const response = await axios.get('/api/physical-persons');
      setPhysicalPersons(response.data); // Asegúrate que aquí venga también "documents"
    } catch (error) {
      console.error('Error fetching physical persons:', error);
    }
  };

  const addPhysicalPerson = async (person) => {
    try {
      const response = await axios.post('/api/physical-persons', person);
      setPhysicalPersons((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding physical person:', error);
    }
  };

  const updatePhysicalPerson = async (id, updatedPerson) => {
    try {
      const response = await axios.put(`/api/physical-persons/${id}`, updatedPerson);
      setPhysicalPersons((prev) =>
        prev.map((person) =>
          person._id === id || person.id === id ? response.data : person
        )
      );
    } catch (error) {
      console.error('Error updating physical person:', error);
      throw error;
    }
  };

  const deletePhysicalPerson = async (id) => {
    try {
      await axios.delete(`/api/physical-persons/${id}`);
      setPhysicalPersons((prev) => prev.filter((person) => person._id !== id));
    } catch (error) {
      console.error('Error deleting physical person:', error);
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
      }}
    >
      {children}
    </PhysicalPersonContext.Provider>
  );
};