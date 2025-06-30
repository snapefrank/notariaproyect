export const initializePropertiesData = () => [
  {
    id: '1',
    name: 'Edificio Central',
    address: 'Av. Principal 123, Ciudad',
    type: 'commercial',
    area: 1500,
    registrationNumber: 'REG-2023-001',
    acquisitionDate: '2020-05-10',
    value: 2500000,
    status: 'active',
    description: 'Edificio de oficinas de 5 pisos en zona comercial',
    documents: ['1', '3']
  },
  {
    id: '2',
    name: 'Residencia Las Palmas',
    address: 'Calle Secundaria 456, Ciudad',
    type: 'residential',
    area: 350,
    registrationNumber: 'REG-2023-002',
    acquisitionDate: '2021-08-15',
    value: 850000,
    status: 'active',
    description: 'Casa residencial con jardín y piscina',
    documents: ['3']
  }
];

export const initializeArtworksData = () => [
  {
    id: '1',
    title: 'Paisaje Nocturno',
    artist: 'Juan Rodríguez',
    year: 2015,
    medium: 'Óleo sobre lienzo',
    dimensions: '120x80 cm',
    acquisitionDate: '2022-03-20',
    value: 45000,
    location: 'Sala principal',
    status: 'active',
    description: 'Obra que representa un paisaje nocturno con luna llena',
    documents: ['2']
  },
  {
    id: '2',
    title: 'Abstracción Geométrica',
    artist: 'María González',
    year: 2018,
    medium: 'Acrílico sobre madera',
    dimensions: '100x100 cm',
    acquisitionDate: '2022-06-15',
    value: 38000,
    location: 'Recepción',
    status: 'active',
    description: 'Composición abstracta con formas geométricas en colores vivos',
    documents: []
  }
];

export const initializeOtherAssetsData = () => [
  {
    id: '1',
    name: 'Colección de Relojes Antiguos',
    type: 'collection',
    quantity: 12,
    acquisitionDate: '2021-11-05',
    value: 85000,
    location: 'Vitrina principal',
    status: 'active',
    description: 'Colección de relojes de bolsillo y de pared de los siglos XVIII y XIX',
    documents: ['4']
  },
  {
    id: '2',
    name: 'Vehículo Mercedes-Benz Clase S',
    type: 'vehicle',
    model: 'S500',
    year: 2022,
    registrationNumber: 'ABC-123',
    acquisitionDate: '2022-01-10',
    value: 120000,
    status: 'active',
    description: 'Vehículo de lujo color negro con interior de cuero',
    documents: []
  }
];