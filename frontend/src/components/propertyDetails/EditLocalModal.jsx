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
import { Switch } from '@/components/ui/switch';
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

    // ✅ Nuevos campos
    hasEncumbrance: false,
    encumbrances: [{ institution: '', amount: '', date: '' }],
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
        cadastralKey: local.cadastralKey || '',
        localExtraDocName: '',
        localExtraDocs: null,

        // ✅ Cargar gravámenes si existen
        hasEncumbrance: local.hasEncumbrance || false,
        encumbrances: local.encumbrances?.length
          ? local.encumbrances.map((g) => ({
              institution: g.institution || '',
              amount: g.amount || '',
              date: g.date ? g.date.substring(0, 10) : '',
            }))
          : [{ institution: '', amount: '', date: '' }],
      });
    }
  }, [local]);

  // ✅ Handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEncumbranceChange = (index, field, value) => {
    const updated = [...form.encumbrances];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, encumbrances: updated }));
  };

  const addEncumbrance = () => {
    setForm((prev) => ({
      ...prev,
      encumbrances: [...prev.encumbrances, { institution: '', amount: '', date: '' }],
    }));
  };

  const removeEncumbrance = (index) => {
    const updated = [...form.encumbrances];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, encumbrances: updated }));
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
      formData.append('cadastralKey', form.cadastralKey);

      // ✅ Gravámenes
      formData.append('hasEncumbrance', form.hasEncumbrance);
      if (form.hasEncumbrance) {
        formData.append('localEncumbrances', JSON.stringify(form.encumbrances));
      }

      // ✅ Documento adicional
      if (form.localExtraDocName) formData.append('localExtraDocName', form.localExtraDocName);
      if (form.localExtraDocs?.[0]) formData.append('localExtraDocs', form.localExtraDocs[0]);

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

      // Refrescar la propiedad actualizada
      const refreshed = await fetch(`${API_URL}/${propertyId}`);
      if (!refreshed.ok) throw new Error('No se pudo obtener la propiedad actualizada');
      const updatedProperty = await refreshed.json();

      onLocalUpdated(updatedProperty);
      onClose();
    } catch (error) {
      console.error('❌ Error al actualizar local:', error);
      alert('Ocurrió un error al guardar los cambios.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Local</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
              <Input name="cadastralKey" value={form.cadastralKey} onChange={handleChange} />
            </div>
            <div>
              <Label>Inicio de renta</Label>
              <Input name="rentStartDate" type="date" value={form.rentStartDate} onChange={handleChange} />
            </div>
            <div>
              <Label>Fin de renta</Label>
              <Input name="rentEndDate" type="date" value={form.rentEndDate} onChange={handleChange} />
            </div>
          </div>

          {/* ✅ Sección Gravámenes */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>¿Cuenta con gravamen?</Label>
              <Switch
                checked={form.hasEncumbrance}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, hasEncumbrance: v }))}
              />
            </div>

            {form.hasEncumbrance && (
              <div className="space-y-4">
                {form.encumbrances.map((enc, idx) => (
                  <div key={idx} className="grid md:grid-cols-3 gap-3 border p-3 rounded-md relative">
                    <div>
                      <Label>Institución</Label>
                      <Input
                        value={enc.institution}
                        onChange={(e) => handleEncumbranceChange(idx, 'institution', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Monto</Label>
                      <Input
                        type="number"
                        value={enc.amount}
                        onChange={(e) => handleEncumbranceChange(idx, 'amount', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Fecha</Label>
                      <Input
                        type="date"
                        value={enc.date}
                        onChange={(e) => handleEncumbranceChange(idx, 'date', e.target.value)}
                      />
                    </div>
                    {form.encumbrances.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
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

          {/* ✅ Documentos */}
          <div className="border-t pt-4 mt-4 space-y-2">
            <Label>Nuevo contrato (opcional)</Label>
            <Input name="contract" type="file" accept="application/pdf" onChange={handleChange} />
            <Label>Nuevas fotos del local (opcional)</Label>
            <Input name="localPhotos" type="file" multiple accept="image/*" onChange={handleChange} />

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
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar Cambios</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocalModal;