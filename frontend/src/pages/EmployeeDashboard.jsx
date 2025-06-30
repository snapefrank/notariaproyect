import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, BellRing, CheckSquare, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/contexts/DocumentContext';
import { useTasks } from '@/contexts/TaskContext';
import TaskForm from '@/components/TaskForm';
import TaskStatusForm from '@/components/TaskStatusForm';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ReminderItem = ({ title, dueDate, severity }) => {
  let bgColor = 'bg-custom-silver/30';
  let textColor = 'text-custom-umber';
  let iconColor = 'text-custom-gray';

  if (severity === 'high') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
    iconColor = 'text-red-600';
  } else if (severity === 'medium') {
    bgColor = 'bg-amber-100';
    textColor = 'text-amber-700';
    iconColor = 'text-amber-600';
  }

  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-center p-3 rounded-lg ${bgColor} dashboard-card-item`}
    >
      <AlertTriangle className={`h-5 w-5 mr-3 ${iconColor}`} />
      <div>
        <p className={`font-medium ${textColor}`}>{title}</p>
        <p className={`text-sm ${textColor}/80`}>Vence: {dueDate}</p>
      </div>
      <Button variant="ghost" size="sm" className="ml-auto text-xs">Ver</Button>
    </motion.div>
  );
};

const PendingTaskItem = ({ title, description, status, onUpdateClick }) => (
  <motion.div
    variants={itemVariants}
    className="p-3 rounded-lg bg-custom-silver/30 dashboard-card-item"
  >
    <div className="flex items-center mb-1">
      <BellRing className="h-5 w-5 mr-2 text-custom-gray" />
      <p className="font-medium text-custom-umber">{title}</p>
    </div>
    <p className="text-sm text-custom-gray/80 mb-2">{description}</p>
    <div className="flex items-center justify-between">
      <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
        {status === 'completed' ? 'Finalizado' : status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
      </span>
      <Button variant="outline" size="sm" className="text-xs border-custom-gray text-custom-gray hover:bg-custom-silver/50" onClick={onUpdateClick}>
        {status === 'completed' ? 'Ver Detalles' : 'Actualizar'}
      </Button>
    </div>
  </motion.div>
);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { documents } = useDocuments();
  const { tasks, addTask, updateTask } = useTasks();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const recentDocuments = documents
    .filter(doc => doc.createdBy === user?.username)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const employeeReminders = [
    { title: "Vencimiento de Contrato Alquiler - Oficina Norte", dueDate: "2025-06-20", severity: "high" },
    { title: "Seguimiento Firma - Cliente Sr. González", dueDate: "2025-06-10", severity: "medium" },
  ];

  const handleUpdateClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedData) => {
    updateTask(selectedTask._id, updatedData);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-custom-umber">Panel de Empleado</h1>
          <p className="text-custom-gray mt-1">
            Bienvenido/a al Sistema Notarial. Aquí están sus tareas y documentos recientes.
          </p>
        </div>

        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-custom-umber text-white hover:bg-custom-umber/90 flex items-center gap-2 self-start sm:self-center">
              <Plus className="h-4 w-4" />
              <span>Nueva Tarea</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-custom-umber">Crear Nueva Tarea</DialogTitle>
              <DialogDescription className="text-custom-gray">Complete el formulario para agregar una nueva tarea.</DialogDescription>
            </DialogHeader>
            <TaskForm
              mode="create"
              onSubmit={(task) => {
                addTask(task);
                setIsTaskFormOpen(false);
              }}
              onCancel={() => setIsTaskFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full dashboard-card-item border-t-4 border-custom-gray">
            <CardHeader>
              <CardTitle className="text-custom-umber flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Mis Recordatorios
              </CardTitle>
              <CardDescription className="text-custom-battleship-gray">Documentos y tareas urgentes asignadas a usted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {employeeReminders.length > 0 ? employeeReminders.map((item, idx) => (
                <ReminderItem key={idx} {...item} />
              )) : <p className="text-custom-gray">No tiene recordatorios urgentes.</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full dashboard-card-item border-t-4 border-custom-gray">
            <CardHeader>
              <CardTitle className="text-custom-umber flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-blue-500" />
                Mis Tareas Pendientes
              </CardTitle>
              <CardDescription className="text-custom-battleship-gray">Tareas asignadas para completar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length > 0 ? tasks.map((item, idx) => (
                <PendingTaskItem key={idx} {...item} onUpdateClick={() => handleUpdateClick(item)} />
              )) : <p className="text-custom-gray">No tiene tareas pendientes.</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="dashboard-card-item border-t-4 border-custom-gray">
          <CardHeader>
            <CardTitle className="text-custom-umber">Mis Documentos Recientes</CardTitle>
            <CardDescription className="text-custom-battleship-gray">Últimos documentos que ha gestionado.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.map(doc => (
                  <Link key={doc.id} to={`/documents/${doc.id}`} className="block p-3 rounded-lg hover:bg-custom-silver/50 transition-colors border border-custom-silver/50">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-custom-umber">{doc.title}</p>
                      <span className="text-xs text-custom-battleship-gray">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-custom-gray line-clamp-1">{doc.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-custom-gray">No ha gestionado documentos recientemente.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="border-custom-gray text-custom-gray hover:bg-custom-silver/50" asChild>
              <Link to="/documents">Ver todos mis documentos</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-custom-umber">Actualizar Estado</DialogTitle>
              <DialogDescription className="text-custom-gray">Modifique el estado y deje un comentario si lo desea.</DialogDescription>
            </DialogHeader>
            <TaskStatusForm
              task={selectedTask}
              onSubmit={handleTaskUpdate}
              onCancel={() => setSelectedTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeDashboard;
