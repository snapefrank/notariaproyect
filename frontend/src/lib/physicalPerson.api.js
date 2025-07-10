// src/lib/physicalPerson.api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/physical-persons';

export const fetchPhysicalPersonById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updatePhysicalPerson = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};


export const deletePhysicalPerson = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
