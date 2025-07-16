import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MoralPersonInformation person={person} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Crédito Financiero</CardTitle>
            </CardHeader>
            <CardContent>
              {person?.credito ? (
                <div className="text-base space-y-3 leading-relaxed">
                  <p><strong>Institución:</strong> {person.credito.institucionFinanciera || 'N/A'}</p>
                  <p><strong>Monto:</strong> ${person.credito.montoCredito?.toLocaleString() || 'N/A'}</p>
                  <p><strong>Plazo:</strong> {person.credito.plazoMeses || 'N/A'} meses</p>
                  <p><strong>Interés Anual:</strong> {person.credito.tasaInteresAnual || 'N/A'}%</p>
                  <p><strong>Pago Mensual:</strong> ${person.credito.pagoMensual?.toLocaleString() || 'N/A'}</p>
                  <p><strong>Tiene inmueble en garantía:</strong> {person.credito.tieneInmuebleGarantia ? 'Sí' : 'No'}</p>

                  {person.credito.tieneInmuebleGarantia && (
                    <>
                      <p><strong>Tipo de Inmueble:</strong> {person.credito.inmuebleGarantia?.tipoInmueble || 'N/A'}</p>
                      <p><strong>Dirección:</strong> {person.credito.inmuebleGarantia?.direccionInmueble || 'N/A'}</p>
                      <p><strong>Valor Comercial:</strong> ${person.credito.inmuebleGarantia?.valorComercial?.toLocaleString() || 'N/A'}</p>

                      {/* Escritura */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Escritura</h3>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <span>
                            {person.credito.inmuebleGarantia?.documentos?.escritura ? 'Disponible' : 'No especificado'}
                          </span>
                          {person.credito.inmuebleGarantia?.documentos?.escritura && (
                            <a
                              href={`${BACKEND_URL}/${person.credito.inmuebleGarantia.documentos.escritura}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Ver archivo
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Documento Adicional */}
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Documento Adicional</h3>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <span>
                            {person.credito.inmuebleGarantia?.documentos?.adicional ? 'Disponible' : 'No especificado'}
                          </span>
                          {person.credito.inmuebleGarantia?.documentos?.adicional && (
                            <a
                              href={`${BACKEND_URL}/${person.credito.inmuebleGarantia.documentos.adicional}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Ver archivo
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {person.credito.observaciones && (
                    <p><strong>Observaciones:</strong> {person.credito.observaciones}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No se ha registrado información de crédito.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Persona Moral</DialogTitle>
            <DialogDescription>Actualice la información de esta persona.</DialogDescription>
          </DialogHeader>
          <MoralPersonForm
            initialData={person}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmación de eliminación */}
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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoralPersonDetails;
