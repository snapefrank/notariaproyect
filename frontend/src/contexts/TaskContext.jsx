import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
const TaskContext = createContext();

// Hook personalizado
export const useTasks = () => useContext(TaskContext);

// Proveedor del contexto
export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Cambia esta URL si usas otra ruta o dominio
  const API_URL = import.meta.env.VITE_API_URL + '/api/tasks';


  // Obtener todas las tareas del backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  // Crear una nueva tarea en backend
  const addTask = async (newTask) => {
    try {
      const response = await axios.post(API_URL, newTask);
      setTasks(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  // Actualizar tarea (status, comentario, etc)
  const updateTask = async (taskId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${taskId}`, updatedData);
      setTasks(prev => prev.map(task => task._id === taskId ? response.data : task));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  // Eliminar tarea por id
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  // Cargar tareas al montar el contexto
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
