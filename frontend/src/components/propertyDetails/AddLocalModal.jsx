import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { apiBase } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch'; // ✅ si usas shadcn/ui

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
    cadastralKey: '',
    localExtraDocName: '',
    localExtraDocFile: null,

    // ✅ Nuevos campos
    hasEncumbrance: false,
    encumbrances: [{ institution: '', amount: '', date: '' }],
  });

  // ✅ Handlers
  const handleChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, files) => {
    setLocalData((prev) => ({ ...prev, [field]: files }));
  };

  const handleEncumbranceChange = (index, field, value) => {
    const updated = [...localData.encumbrances];
    updated[index][field] = value;
    setLocalData((prev) => ({ ...prev, encumbrances: updated }));
  };

  const addEncumbrance = () => {
    setLocalData((prev) => ({
      ...prev,
      encumbrances: [...prev.encumbrances, { institution: '', amount: '', date: '' }],
    }));
  };

  const removeEncumbrance = (index) => {
    const updated = [...localData.encumbrances];
    updated.splice(index, 1);
    setLocalData((prev) => ({ ...prev, encumbrances: updated }));
  };

  // ✅ Submit
  const handleSubmit = async () => {
    console.log('🟡 Subiendo local…');

    const formData = new FormData();
    formData.append('name', localData.name);
    formData.append('tenant', localData.tenant);
    formData.append('rentedArea', localData.rentedArea);
    formData.append('rentCost', localData.rentCost);
    formData.append('rentStartDate', localData.rentStartDate);
    formData.append('rentEndDate', localData.rentEndDate);
    formData.append('cadastralKey', localData.cadastralKey);

    // ✅ Gravámenes
    formData.append('hasEncumbrance', localData.hasEncumbrance);
    if (localData.hasEncumbrance) {
      formData.append('localEncumbrances', JSON.stringify(localData.encumbrances));
    }

    // ✅ Documento adicional
    if (localData.localExtraDocName) formData.append('localExtraDocName', localData.localExtraDocName);
    if (localData.localExtraDocFile) formData.append('localExtraDocs', localData.localExtraDocFile);

    // ✅ Contrato
    if (localData.rentContractFile?.[0]) formData.append('contract', localData.rentContractFile[0]);

    // ✅ Fotos
    if (localData.photos?.length > 0) {
      Array.from(localData.photos).forEach((photo) => {
        formData.append('localPhotos', photo);
      });
    }

    try {
      const response = await axios.post(`${apiBase}/api/properties/${propertyId}/locals`, formData, {
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
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
            <Label>Clave catastral</Label>
            <Input
              value={localData.cadastralKey}
              onChange={(e) => handleChange('cadastralKey', e.target.value)}
              placeholder="Ej. 12-34-56-789-000"
            />
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
            <Input type="file" name="contract" accept=".pdf" onChange={(e) => handleFileChange('rentContractFile', e.target.files)} />
          </div>

          <div className="col-span-2">
            <Label>Fotos del local</Label>
            <Input type="file" multiple accept="image/*" onChange={(e) => handleFileChange('photos', e.target.files)} />
          </div>

          <div className="col-span-2 border-t pt-4 mt-2">
            <div className="flex items-center justify-between">
              <Label>¿Cuenta con gravamen?</Label>
              <Switch checked={localData.hasEncumbrance} onCheckedChange={(v) => handleChange('hasEncumbrance', v)} />
            </div>

            {localData.hasEncumbrance && (
              <div className="mt-4 space-y-4">
                {localData.encumbrances.map((enc, idx) => (
                  <div key={idx} className="border p-3 rounded-lg grid md:grid-cols-3 gap-3 relative">
                    <div>
                      <Label>Institución</Label>
                      <Input value={enc.institution} onChange={(e) => handleEncumbranceChange(idx, 'institution', e.target.value)} />
                    </div>
                    <div>
                      <Label>Monto</Label>
                      <Input type="number" value={enc.amount} onChange={(e) => handleEncumbranceChange(idx, 'amount', e.target.value)} />
                    </div>
                    <div>
                      <Label>Fecha</Label>
                      <Input type="date" value={enc.date} onChange={(e) => handleEncumbranceChange(idx, 'date', e.target.value)} />
                    </div>
                    {localData.encumbrances.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="absolute -top-2 -right-2 px-2 py-1"
                        onClick={() => removeEncumbrance(idx)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}

                <Button type="button" variant="secondary" onClick={addEncumbrance}>
                  + Agregar otro gravamen
                </Button>
              </div>
            )}
          </div>

          <div className="col-span-2 border-t pt-4 mt-4">
            <Label>Documento adicional</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => handleFileChange('localExtraDocFile', e.target.files?.[0] || null)}
            />
            {localData.localExtraDocFile && (
              <div className="mt-2">
                <Label>Nombre del documento</Label>
                <Input
                  value={localData.localExtraDocName}
                  onChange={(e) => handleChange('localExtraDocName', e.target.value)}
                  placeholder={`Ej. ${localData.localExtraDocFile.name}`}
                />
              </div>
            )}
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