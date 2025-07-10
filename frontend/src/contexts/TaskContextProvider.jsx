
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const TaskContext = createContext();
const API_URL = import.meta.env.VITE_API_URL + '/api/tasks';

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  
 

  const addTask = async (newTask) => {
    try {
      const response = await axios.post(API_URL, newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
