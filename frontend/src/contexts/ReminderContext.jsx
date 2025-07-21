import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reminders`);
        console.log("🔔 Recordatorios recibidos:", res.data); 
        setReminders(res.data);
      } catch (err) {
        console.error('❌ Error al obtener recordatorios', err);
      }
    };

    fetchReminders();
  }, []);

  return (
    <ReminderContext.Provider value={{ reminders }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => useContext(ReminderContext);
