import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PhysicalPersonInformation = ({ person }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">RFC</h3>
          <p className="text-base">{person.rfc || 'No especificado'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">CURP</h3>
          <p className="text-base">{person.curp || 'No especificado'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Dirección</h3>
          <p className="text-base">{person.direccion || 'No especificada'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Seguro</h3>
          <p className="text-base">{person.seguro || 'No especificado'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicalPersonInformation;
