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

import PhysicalPersonHeader from '@/components/PhysicalPersonDetails/PhysicalPersonHeader';
import PhysicalPersonInformation from '@/components/PhysicalPersonDetails/PhysicalPersonInformation';
import LoadingSpinner from '@/components/documentDetails/LoadingSpinner';
import NotFoundMessage from '@/components/documentDetails/NotFoundMessage';
import PhysicalPersonForm from '@/components/PhysicalPersonForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

import {
  fetchPhysicalPersonById,
  updatePhysicalPerson,
  deletePhysicalPerson
} from '@/lib/physicalPerson.api';

const PhysicalPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const data = await fetchPhysicalPersonById(id);
        if (data) setPerson(data);
      } catch (error) {
        console.error('Error al obtener persona física:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updatePhysicalPerson(id, formData);

      // Volver a cargar los datos actualizados desde backend:
      const updated = await fetchPhysicalPersonById(id);
      setPerson(updated);
      setIsEditDialogOpen(false);

    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePhysicalPerson(id);
      setIsDeleteDialogOpen(false);
      navigate('/personas-fisicas');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!person) return <NotFoundMessage onBack={() => navigate('/personas-fisicas')} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/personas-fisicas')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Personas
        </Button>
        <PhysicalPersonHeader
          person={person}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PhysicalPersonInformation person={person} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informacion del Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(person.datosMedicos) && person.datosMedicos.length > 0 ? (
                <div className="space-y-6">
                  {person.datosMedicos.map((seguro, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-semibold mb-2">Seguro #{index + 1}</h4>
                      <div className="space-y-1 text-base leading-relaxed">
                        <p><strong>Tipo de Sangre:</strong> {seguro.tipoSangre || 'No especificado'}</p>
                        <p><strong>Aseguradora:</strong> {seguro.aseguradora || 'No especificado'}</p>
                        <p><strong>Tipo de Seguro:</strong> {seguro.tipoSeguro || 'No especificado'}</p>
                        <p><strong>Beneficiarios:</strong> {seguro.beneficiarios || 'No especificado'}</p>
                        <p><strong>Inicio de Vigencia:</strong> {formatDate(seguro.fechaInicioVigencia)}</p>
                        <p><strong>Vencimiento:</strong> {formatDate(seguro.fechaVencimiento)}</p>
                        <p><strong>Número de Póliza:</strong> {seguro.numeroPoliza || 'No especificado'}</p>
                        <p><strong>Prima:</strong> {seguro.prima || 'No especificado'}</p>
                        {/* Archivos del Seguro */}
                        {Array.isArray(seguro.archivoSeguro) && seguro.archivoSeguro.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Archivos del Seguro</h4>
                            <ul className="space-y-2">
                              {seguro.archivoSeguro.map((ruta, archivoIndex) => (
                                <li
                                  key={archivoIndex}
                                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                                >
                                  <span>Archivo {archivoIndex + 1}</span>
                                  <a
                                    href={`${BACKEND_URL}/${ruta}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      Ver archivo
                                    </Button>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>No especificado</span>
              )}
            </CardContent>
            <div className="flex justify-end mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Agregar o Editar Seguro
              </Button>
            </div>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Créditos Financieros</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(person.creditos) && person.creditos.length > 0 ? (
                person.creditos.map((credito, index) => (
                  <div key={index} className="mb-6 border rounded-md p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700">Crédito #{index + 1}</h4>
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

                    {/* Mostrar siempre los documentos si existen */}
                    {Array.isArray(credito.archivoCredito) && credito.archivoCredito.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Documentos del Crédito</h3>
                        <ul className="space-y-2">
                          {credito.archivoCredito.map((ruta, archivoIndex) => (
                            <li
                              key={archivoIndex}
                              className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                            >
                              <span>Archivo {archivoIndex + 1}</span>
                              <a
                                href={`${BACKEND_URL}/${ruta}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Ver archivo
                                </Button>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {credito.observaciones && (
                      <p><strong>Observaciones:</strong> {credito.observaciones}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No se ha registrado información de crédito.</p>
              )}
            </CardContent>
          </Card>

        </motion.div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Persona Física</DialogTitle>
            <DialogDescription>Actualice la información de esta persona.</DialogDescription>
          </DialogHeader>
          <PhysicalPersonForm
            initialData={person}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
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

export default PhysicalPersonDetails;