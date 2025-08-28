import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiBase } from '@/lib/constants';

const API_URL = import.meta.env.VITE_API_URL + '/api/properties';
const EditLocalModal = ({ open, onClose, propertyId, local, index, onLocalUpdated }) => {
    const [form, setForm] = useState({
        name: '',
        tenant: '',
        rentedArea: '',
        rentCost: '',
        rentStartDate: '',
        rentEndDate: '',
        contract: null,
        localPhotos: [],
        cadastralKey: '',
        localExtraDocName: '',
        localExtraDocs: null,
    });

    useEffect(() => {
        if (local) {
            setForm({
                name: local.name || '',
                tenant: local.tenant || '',
                rentedArea: local.rentedArea || '',
                rentCost: local.rentCost || '',
                rentStartDate: local.rentStartDate?.substring(0, 10) || '',
                rentEndDate: local.rentEndDate?.substring(0, 10) || '',
                contract: null,
                localPhotos: [],
                // ✅ NUEVO:
                cadastralKey: local.cadastralKey || '',
                localExtraDocName: '',
                localExtraDocs: null,
            });
        }
    }, [local]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm((prev) => ({ ...prev, [name]: files }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('tenant', form.tenant);
            formData.append('rentedArea', form.rentedArea);
            formData.append('rentCost', form.rentCost);
            formData.append('rentStartDate', form.rentStartDate);
            formData.append('rentEndDate', form.rentEndDate);

            // ✅ Clave catastral
            if (form.cadastralKey) {
                formData.append('cadastralKey', form.cadastralKey);
            }

            // ✅ Documento adicional (nombre + archivo) — se ANEXA
            if (form.localExtraDocName) {
                formData.append('localExtraDocName', form.localExtraDocName);
            }
            if (form.localExtraDocs?.[0]) {
                formData.append('localExtraDocs', form.localExtraDocs[0]);
            }

            if (form.contract?.[0]) formData.append('contract', form.contract[0]);
            if (form.localPhotos?.length > 0) {
                for (const file of form.localPhotos) {
                    formData.append('localPhotos', file);
                }
            }

            const response = await fetch(`${API_URL}/${propertyId}/locals/${index}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('No se pudo actualizar el local.');

            // Aquí traemos de nuevo la propiedad actualizada
            const refreshed = await fetch(`${API_URL}/${propertyId}`);
            if (!refreshed.ok) throw new Error('No se pudo obtener la propiedad actualizada');
            const updatedProperty = await refreshed.json();

            onLocalUpdated(updatedProperty); // 🔄 Pasamos la propiedad ya actualizada
            onClose();
        } catch (error) {
            console.error('❌ Error al actualizar local:', error);
            alert('Ocurrió un error al guardar los cambios.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Local</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Nombre del local</Label>
                        <Input name="name" value={form.name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Arrendatario</Label>
                        <Input name="tenant" value={form.tenant} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Área rentada (m²)</Label>
                        <Input name="rentedArea" type="number" value={form.rentedArea} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Costo de renta</Label>
                        <Input name="rentCost" type="number" value={form.rentCost} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Clave catastral</Label>
                        <Input name="cadastralKey" value={form.cadastralKey} onChange={handleChange} placeholder="Ej. 12-34-56-789-000" />
                    </div>

                    <div>
                        <Label>Inicio de renta</Label>
                        <Input name="rentStartDate" type="date" value={form.rentStartDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Fin de renta</Label>
                        <Input name="rentEndDate" type="date" value={form.rentEndDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Nuevo contrato (opcional)</Label>
                        <Input name="contract" type="file" accept="application/pdf" onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Nuevas fotos del local (opcional)</Label>
                        <Input name="localPhotos" type="file" multiple accept="image/*" onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Nombre del documento adicional</Label>
                        <Input
                            name="localExtraDocName"
                            value={form.localExtraDocName}
                            onChange={handleChange}
                            placeholder="Ej. Licencia de uso de suelo"
                            className="mb-2"
                        />
                        <Label>Documento adicional</Label>
                        <Input
                            name="localExtraDocs"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={handleChange}
                        />
                    </div>


                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar Cambios</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditLocalModal;
