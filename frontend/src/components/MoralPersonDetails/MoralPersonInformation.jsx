import React from 'react';

const MoralPersonInformation = ({ person }) => (
  <div className="bg-white p-6 rounded-md shadow-md space-y-4">
    <div>
      <h3 className="font-semibold text-sm text-muted-foreground">Razón Social</h3>
      <p>{person.nombre || 'No especificada'}</p>
    </div>

    <div>
      <h3 className="font-semibold text-sm text-muted-foreground">RFC</h3>
      <p>{person.rfc || 'No especificado'}</p>
    </div>

    <div>
      <h3 className="font-semibold text-sm text-muted-foreground">Régimen Fiscal</h3>
      <p>{person.regimenFiscal || 'No especificado'}</p>
    </div>

    <div>
      <h3 className="font-semibold text-sm text-muted-foreground">Dirección</h3>
      <p>{person.domicilioFiscal || 'No especificada'}</p>
    </div>

    <div>
      <h3 className="font-semibold text-sm text-muted-foreground">Fecha de Constitución</h3>
      <p>
        {person.fechaConstitucion
          ? new Date(person.fechaConstitucion).toLocaleDateString()
          : 'No especificada'}
      </p>
    </div>
  </div>
);

export default MoralPersonInformation;
