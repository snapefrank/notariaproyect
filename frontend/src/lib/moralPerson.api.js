// src/lib/moralPerson.api.js
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/api/moral-persons';

export const getMoralPersonById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateMoralPerson = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteMoralPerson = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
