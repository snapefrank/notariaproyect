import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

import LoadingSpinner from '@/components/documentDetails/LoadingSpinner';
import NotFoundMessage from '@/components/documentDetails/NotFoundMessage';
import MoralPersonForm from '@/components/MoralPersonForm';
import MoralPersonInformation from '@/components/MoralPersonDetails/MoralPersonInformation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  getMoralPersonById,
  updateMoralPerson,
  deleteMoralPerson
} from '@/lib/moralPerson.api';

const MoralPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const data = await getMoralPersonById(id);
        if (data) setPerson(data);
      } catch (error) {
        console.error('Error al obtener persona moral:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateMoralPerson(id, formData);
      const updated = await getMoralPersonById(id);
      setPerson(updated);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error al actualizar persona moral:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMoralPerson(id);
      setIsDeleteDialogOpen(false);
      navigate('/personas-morales');
    } catch (error) {
      console.error('Error al eliminar persona moral:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!person) return <NotFoundMessage onBack={() => navigate('/personas-morales')} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/personas-morales')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Personas
        </Button>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{person.nombre}</h1>
          <div className="space-x-2">
            <Button variant="default" onClick={() => setIsEditDialogOpen(true)}>Editar</Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Eliminar</Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <MoralPersonInformation person={person} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Créditos Financieros</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(person.creditos) && person.creditos.length > 0 ? (
                person.creditos.map((credito, index) => (
                  <div key={index} className="border rounded-md p-4 mb-6 space-y-3 bg-white shadow-sm">
                    <h4 className="text-lg font-semibold text-primary mb-3">Crédito #{index + 1}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <p><strong>Institución:</strong> {credito.institucionFinanciera || 'N/A'}</p>
                      <p><strong>Monto:</strong> ${credito.montoCredito?.toLocaleString() || 'N/A'}</p>
                      <p><strong>Plazo:</strong> {credito.plazoMeses || 'N/A'} meses</p>
                      <p><strong>Interés Anual:</strong> {credito.tasaInteresAnual || 'N/A'}%</p>
                      <p><strong>Pago Mensual:</strong> ${credito.pagoMensual?.toLocaleString() || 'N/A'}</p>
                      <p><strong>Tiene inmueble en garantía:</strong> {credito.tieneInmuebleGarantia ? 'Sí' : 'No'}</p>

                      {credito.tieneInmuebleGarantia && (
                        <>
                          <p><strong>Tipo de Inmueble:</strong> {credito.tipoInmueble || 'N/A'}</p>
                          <p><strong>Dirección:</strong> {credito.direccionInmueble || 'N/A'}</p>
                          <p><strong>Valor Comercial:</strong> ${credito.valorComercial?.toLocaleString() || 'N/A'}</p>
                        </>
                      )}
                    </div>

                    {Array.isArray(credito.archivoCredito) && credito.archivoCredito.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Documentos del Crédito</h3>
                        {credito.archivoCredito.map((archivo, i) => {
                          const url = typeof archivo === 'string'
                            ? archivo
                            : archivo?.url || archivo?.archivo || null;
                          if (!url) return null;
                          const label = typeof archivo === 'string'
                            ? `Archivo ${i + 1}`
                            : archivo?.nombre || `Archivo ${i + 1}`;
                          return (
                            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-md mt-2">
                              <span>{label}</span>
                              <div className="space-x-2">
                                <Button variant="outline" size="sm" onClick={() => window.open(`${BACKEND_URL}/${url}`, '_blank')}>Visualizar</Button>
                                <Button variant="default" size="sm" onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = `${BACKEND_URL}/${url}`;
                                  a.download = label;
                                  a.target = '_blank';
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }}>Descargar</Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {credito.observaciones && (
                      <p className="text-sm"><strong>Observaciones:</strong> {credito.observaciones}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">No se han registrado créditos financieros.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Persona Moral</DialogTitle>
            <DialogDescription>Actualice la información de esta persona.</DialogDescription>
          </DialogHeader>
          <MoralPersonForm initialData={person} onSubmit={handleUpdate} onCancel={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La persona será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoralPersonDetails;
