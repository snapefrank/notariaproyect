import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const AssociationContext = createContext();
const API_URL = import.meta.env.VITE_API_URL + '/api/associations';
export const useAssociations = () => {
  return useContext(AssociationContext);
};

export const AssociationProvider = ({ children }) => {
  const [associations, setAssociations] = useState([]);

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await axios.get(API_URL);
        setAssociations(response.data);
      } catch (error) {
        console.error('Error fetching associations:', error);
      }
    };

    fetchAssociations();
  }, []);

  const addAssociation = async (association) => {
    try {
      const response = await axios.post(API_URL, association);
      setAssociations([...associations, response.data]);
    } catch (error) {
      console.error('Error adding association:', error);
    }
  };

  const updateAssociation = async (id, updatedAssociation) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedAssociation);
      setAssociations(associations.map(assoc => assoc._id === id ? response.data : assoc));
    } catch (error) {
      console.error('Error updating association:', error);
    }
  };

  const deleteAssociation = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAssociations(associations.filter(assoc => assoc._id !== id));
    } catch (error) {
      console.error('Error deleting association:', error);
    }
  };

  const getAssociationById = (id) => {
    return associations.find((assoc) => assoc._id === id);
  };

  return (
    <AssociationContext.Provider value={{
      associations,
      addAssociation,
      updateAssociation,
      deleteAssociation,
      getAssociationById // 👈 ahora está disponible
    }}>
      {children}
    </AssociationContext.Provider>
  );
};
