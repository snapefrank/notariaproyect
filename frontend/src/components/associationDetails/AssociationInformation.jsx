import React from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiBase } from '@/lib/constants';

const AssociationInformation = ({ association, onRefresh }) => {
  const deleteRfc = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar el RFC?')) return;
    try {
      await axios.delete(`${apiBase}/api/associations/${association._id}/rfc`);
      alert('✅ RFC eliminado correctamente');
      onRefresh?.();
    } catch (err) {
      console.error('❌ Error al eliminar RFC:', err);
      alert('Hubo un error al eliminar el RFC');
    }
  };

  const deleteDeed = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar la Escritura?')) return;
    try {
      await axios.delete(`${apiBase}/api/associations/${association._id}/deed`);
      alert('✅ Escritura eliminada correctamente');
      onRefresh?.();
    } catch (err) {
      console.error('❌ Error al eliminar Escritura:', err);
      alert('Hubo un error al eliminar la Escritura');
    }
  };

  const deleteAdditionalFile = async (index) => {
    if (!window.confirm('¿Seguro que deseas eliminar este documento adicional?')) return;
    try {
      await axios.delete(`${apiBase}/api/associations/${association._id}/additional/${index}`);
      alert('✅ Documento adicional eliminado correctamente');
      onRefresh?.();
    } catch (err) {
      console.error('❌ Error al eliminar documento adicional:', err);
      alert('Hubo un error al eliminar el documento adicional');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Asociación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información general */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Nombre" value={association.nombre} />
          <Info label="Apoderado legal" value={association.apoderadoLegal} />
          <Info label="Número de escritura" value={association.numeroEscritura} />
          <Info label="Fecha de escritura" value={association.fechaEscritura?.slice(0, 10)} />
          <Info label="Régimen fiscal" value={association.regimenFiscal} />
          <Info label="RFC" value={association.rfc} />
        </div>

        {/* Sección de documentos */}
        {(association.deedFile || association.rfcFile || (association.additionalFiles?.length > 0)) && (
          <div className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Documentos</h3>
            <div className="space-y-3">
              {/* Escritura */}
              {association.deedFile && (
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span>Escritura</span>
                  </div>
                  <div className="space-x-2">
                    <a href={`${apiBase}/${association.deedFile}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">Ver</Button>
                    </a>
                    <Button variant="destructive" size="sm" onClick={deleteDeed}>🗑</Button>
                  </div>
                </div>
              )}

              {/* RFC */}
              {association.rfcFile && (
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span>RFC</span>
                  </div>
                  <div className="space-x-2">
                    <a href={`${apiBase}/${association.rfcFile}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">Ver</Button>
                    </a>
                    <Button variant="destructive" size="sm" onClick={deleteRfc}>🗑</Button>
                  </div>
                </div>
              )}

              {/* Documentos adicionales */}
              {association.additionalFiles && association.additionalFiles.length > 0 && (
                <div className="p-4 border rounded-md">
                  <p className="text-sm font-medium mb-2">Documentos adicionales</p>
                  <div className="space-y-2">
                    {association.additionalFiles.map((filePath, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">Documento {index + 1}</span>
                        </div>
                        <div className="space-x-2">
                          <a href={`${apiBase}/${filePath}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Ver</Button>
                          </a>
                          <Button variant="destructive" size="sm" onClick={() => deleteAdditionalFile(index)}>🗑</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || 'No especificado'}</p>
  </div>
);

export default AssociationInformation;
