import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ✅ Definimos primero el componente
const TaskStatusForm = ({ task, onSubmit, onCancel }) => {
  const [status, setStatus] = useState(task?.status || 'pending');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Finalizado</option>
        </select>
      </div>

      <div>
        <Label htmlFor="comment">Comentario</Label>
        <Input
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Actualizar</Button>
      </div>
    </form>
  );
};

// ✅ Luego hacemos la exportación por defecto
export default TaskStatusForm;
