import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Building, PaintBucket, Package, BarChart, Users, AlertTriangle, BellRing } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/contexts/DocumentContext';
import { useAssets } from '@/contexts/AssetContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

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
    </motion.div>
  );
};

const PendingTaskItem = ({ title, description, assignedTo }) => (
  <motion.div 
    variants={itemVariants}
    className="p-3 rounded-lg bg-custom-silver/30 dashboard-card-item"
  >
    <div className="flex items-center mb-1">
      <BellRing className="h-5 w-5 mr-2 text-custom-gray" />
      <p className="font-medium text-custom-umber">{title}</p>
    </div>
    <p className="text-sm text-custom-gray/80 mb-1">{description}</p>
    <p className="text-xs text-custom-battleship-gray">Asignado a: {assignedTo}</p>
  </motion.div>
);


const OwnerDashboard = () => {
  const { user } = useAuth();
  const { documents } = useDocuments();
  const { properties, artworks, otherAssets } = useAssets();
  
  const reminders = [
    { title: "Renovación de Póliza de Seguro - Inmueble Central", dueDate: "2025-06-15", severity: "high" },
    { title: "Certificado de Autenticidad - Obra 'El Amanecer'", dueDate: "2025-07-01", severity: "medium" },
    { title: "Pago de Impuesto Predial - Lote Sur", dueDate: "2025-06-30", severity: "medium" },
  ];

  const pendingTasks = [
    { title: "Verificación de Documentos - Nueva Adquisición", description: "Revisar la documentación completa del inmueble adquirido la semana pasada.", assignedTo: "Juan Pérez" },
    { title: "Actualización de Avalúo - Colección de Monedas", description: "Solicitar y registrar el nuevo avalúo de la colección.", assignedTo: "María López" },
  ];
  
  const totalAssets = properties.length + artworks.length + otherAssets.length;
  const totalDocuments = documents.length;
  const totalValue = [...properties, ...artworks, ...otherAssets].reduce((sum, asset) => sum + Number(asset.value || 0), 0);
  
  const stats = [
    { title: "Documentos Totales", value: totalDocuments, icon: FileText, color: "var(--color-umber)" },
    { title: "Activos Totales", value: totalAssets, icon: Package, color: "var(--color-gray)" },
    { title: "Valor Total Estimado", value: `${totalValue.toLocaleString()}`, icon: BarChart, color: "var(--color-battleship-gray)" },
    { title: "Usuarios Activos", value: "3", icon: Users, color: "var(--color-silver)" }, 
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-custom-umber">Panel de Administrador</h1>
        <p className="text-custom-gray mt-1">
          Bienvenido/a al Sistema Notarial. Aquí tiene un resumen general.
        </p>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map(stat => (
          <motion.div key={stat.title} variants={itemVariants}>
            <StatCard 
              title={stat.title} 
              value={stat.value} 
              icon={<stat.icon />} 
              color={stat.color} 
            />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full dashboard-card-item border-t-4 border-custom-gray">
            <CardHeader>
              <CardTitle className="text-custom-umber flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Recordatorios Importantes
              </CardTitle>
              <CardDescription className="text-custom-battleship-gray">Documentos y tareas que requieren atención próxima.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reminders.length > 0 ? reminders.map((item, idx) => (
                <ReminderItem key={idx} {...item} />
              )) : <p className="text-custom-gray">No hay recordatorios urgentes.</p>}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="h-full dashboard-card-item border-t-4 border-custom-gray">
            <CardHeader>
              <CardTitle className="text-custom-umber flex items-center">
                <BellRing className="h-5 w-5 mr-2 text-blue-500" />
                Pendientes del Equipo
              </CardTitle>
              <CardDescription className="text-custom-battleship-gray">Tareas asignadas y en progreso por los empleados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.length > 0 ? pendingTasks.map((item, idx) => (
                <PendingTaskItem key={idx} {...item} />
              )) : <p className="text-custom-gray">No hay tareas pendientes asignadas.</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="dashboard-card-item border-t-4 border-custom-gray">
          <CardHeader>
            <CardTitle className="text-custom-umber">Resumen de Actividad Reciente</CardTitle>
            <CardDescription className="text-custom-battleship-gray">Últimos documentos y activos modificados.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-custom-gray">La actividad reciente se mostrará aquí.</p>
            <div className="mt-4 space-y-2">
              {documents.slice(0,3).map(doc => (
                <div key={doc.id} className="p-2 rounded bg-custom-silver/20 text-sm">
                  <span className="font-medium text-custom-umber">{doc.title}</span>
                  <span className="text-custom-gray"> fue actualizado el {new Date(doc.updatedAt).toLocaleDateString()}.</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="border-custom-gray text-custom-gray hover:bg-custom-silver/50" asChild>
              <Link to="/documents">Ver todos los documentos</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

    </div>
  );
};

export default OwnerDashboard;