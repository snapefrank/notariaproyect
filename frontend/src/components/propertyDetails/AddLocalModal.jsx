import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { apiBase } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL + '/api/properties';

const AddLocalModal = ({ open, onClose, propertyId, onLocalAdded }) => {
    const { toast } = useToast();

    const [localData, setLocalData] = useState({
        name: '',
        tenant: '',
        rentedArea: '',
        rentCost: '',
        rentStartDate: '',
        rentEndDate: '',
        rentContractFile: null,
        photos: [],
    });

    const handleChange = (field, value) => {
        setLocalData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field, files) => {
        setLocalData((prev) => ({ ...prev, [field]: files }));
    };

    const handleSubmit = async () => {
        console.log('🟡 Subiendo local…'); // Log de inicio

        const formData = new FormData();
        formData.append('name', localData.name);
        formData.append('tenant', localData.tenant);
        formData.append('rentedArea', localData.rentedArea);
        formData.append('rentCost', localData.rentCost);
        formData.append('rentStartDate', localData.rentStartDate);
        formData.append('rentEndDate', localData.rentEndDate);

        if (localData.rentContractFile?.[0]) {
            formData.append('contract', localData.rentContractFile[0]);
            console.log('📄 Contrato adjuntado:', localData.rentContractFile[0].name);
        }

        if (localData.photos?.length > 0) {
            Array.from(localData.photos).forEach((photo, i) => {
                formData.append('localPhotos', photo);
                console.log(`🖼️ Foto #${i + 1} adjuntada:`, photo.name);
            });
        }

        try {
            const response = await axios.post(`${apiBase}/${API_URL}/${propertyId}/locals`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('✅ Local guardado:', response.data);

            toast({
                title: 'Local agregado',
                description: 'El local fue registrado exitosamente en el inmueble.',
            });

            await onLocalAdded();
            onClose();
        } catch (error) {
            console.error('❌ Error al agregar local:', error);
            toast({
                title: 'Error al guardar local',
                description: 'No se pudo registrar el local. Verifica los datos o intenta más tarde.',
                variant: 'destructive',
            });
        }
    };



    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Agregar Local al Inmueble</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Nombre del Local</Label>
                        <Input value={localData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div>
                        <Label>Arrendatario</Label>
                        <Input value={localData.tenant} onChange={(e) => handleChange('tenant', e.target.value)} />
                    </div>
                    <div>
                        <Label>Superficie rentada</Label>
                        <Input value={localData.rentedArea} onChange={(e) => handleChange('rentedArea', e.target.value)} />
                    </div>
                    <div>
                        <Label>Costo de renta</Label>
                        <Input type="number" value={localData.rentCost} onChange={(e) => handleChange('rentCost', e.target.value)} />
                    </div>
                    <div>
                        <Label>Inicio de renta</Label>
                        <Input type="date" value={localData.rentStartDate} onChange={(e) => handleChange('rentStartDate', e.target.value)} />
                    </div>
                    <div>
                        <Label>Fin de renta</Label>
                        <Input type="date" value={localData.rentEndDate} onChange={(e) => handleChange('rentEndDate', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <Label>Contrato de arrendamiento</Label>
                        <Input
                            type="file"
                            name="contract" // ✅ AÑADIDO
                            accept=".pdf"
                            onChange={(e) => handleFileChange('rentContractFile', e.target.files)}
                        />
                    </div>

                    <div className="col-span-2">
                        <Label>Fotos del local</Label>
                        <Input type="file" multiple accept="image/*" onChange={(e) => handleFileChange('photos', e.target.files)} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar Local</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddLocalModal;
