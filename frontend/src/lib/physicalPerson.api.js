// src/lib/physicalPerson.api.js
import axios from 'axios';

export const fetchPhysicalPersonById = async (id) => {
  const res = await axios.get(`/api/physical-persons/${id}`);
  return res.data;
};

export const updatePhysicalPerson = async (id, data) => {
  const res = await axios.put(`/api/physical-persons/${id}`, data);
  return res.data;
};

export const deletePhysicalPerson = async (id) => {
  const res = await axios.delete(`/api/physical-persons/${id}`);
  return res.data;
};
