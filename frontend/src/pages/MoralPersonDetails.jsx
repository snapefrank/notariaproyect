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

// 👇 Importa funciones API
import { getMoralPersonById, updateMoralPerson, deleteMoralPerson } from '@/lib/moralPerson.api';


const MoralPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      const updated = await fetchMoralPersonById(id);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Información de la Persona Moral</h3>
          <div className="text-sm space-y-2">
            <p><strong>Razón Social:</strong> {person.nombre}</p>
            <p><strong>RFC:</strong> {person.rfc}</p>
            <p><strong>Régimen Fiscal:</strong> {person.regimenFiscal || 'N/A'}</p>
            <p><strong>Dirección:</strong> {person.domicilioFiscal || 'N/A'}</p>
            <p><strong>Fecha de Constitución:</strong> {person.fechaConstitucion?.split('T')[0] || 'N/A'}</p>
          </div>
        </motion.div>

        {/* Crédito Financiero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-md space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">Crédito Financiero</h3>

          {person?.credito ? (
            <div className="text-sm space-y-2">
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

                  <div className="pt-2 space-y-1">
                    {person.credito.inmuebleGarantia?.documentos?.escritura && (
                      <a
                        href={`/${person.credito.inmuebleGarantia.documentos.escritura}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver Escritura (PDF)
                      </a>
                    )}
                    {person.credito.inmuebleGarantia?.documentos?.adicional && (
                      <a
                        href={`/${person.credito.inmuebleGarantia.documentos.adicional}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver Documento Adicional (PDF)
                      </a>
                    )}
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
