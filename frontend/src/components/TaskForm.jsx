import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';  // Importa el hook

const TaskForm = ({ task = {}, onSubmit, onCancel, mode = 'create' }) => {
  const { user } = useAuth();  // Obtén el usuario actual

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    status: 'pending',
    comment: '',
  });

  useEffect(() => {
    if (task && Object.keys(task).length > 0) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: task.startDate || '',
        dueDate: task.dueDate || '',
        status: task.status || 'pending',
        comment: task.comment || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const taskDataToSend = {
      ...formData,
      createdBy: user?.username || user?.id || 'desconocido',  // Agrega createdBy aquí
    };

    console.log('Datos de la tarea que se enviarán:', taskDataToSend);

    onSubmit(taskDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'create' && (
        <>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Fecha Límite</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Finalizado</option>
        </select>
      </div>

      {mode === 'update' && (
        <div>
          <Label htmlFor="comment">Comentario</Label>
          <Input
            type="text"
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default TaskForm;
