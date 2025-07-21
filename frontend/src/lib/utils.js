import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}
export function formatCurrency(value) {
  if (!value && value !== 0) return 'No disponible';

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value));
}


export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getAssetTypeLabel(type) {
  switch (type) {
    case 'property':
      return 'Inmueble';
    case 'artwork':
      return 'Obra de Arte';
    case 'other':
      return 'Otro Activo';
    default:
      return type;
  }
}

export function getDocumentCategoryLabel(category) {
  switch (category) {
    case 'legal':
      return 'Legal';
    case 'contract':
      return 'Contrato';
    case 'certificate':
      return 'Certificado';
    case 'insurance':
      return 'Seguro';
    default:
      return category;
  }
}