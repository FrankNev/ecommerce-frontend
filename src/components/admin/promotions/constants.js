import { Globe, Target, Percent, DollarSign } from 'lucide-react';

export const EMPTY_FORM = {
  name: '',
  description: '',
  type: 'GLOBAL',
  discount_type: 'PERCENTAGE',
  value: '',
  start_date: '',
  end_date: '',
  priority: 0,
  is_active: true,
  conditions: { min_purchase: '', excluded_categories: [], excluded_brands: [] },
  product_ids: [],
};

export const TYPE_LABELS = {
  GLOBAL:   { label: 'Global',     icon: Globe,   color: 'text-blue-600 bg-blue-50' },
  SPECIFIC: { label: 'Específica', icon: Target,   color: 'text-purple-600 bg-purple-50' },
};

export const DISCOUNT_LABELS = {
  PERCENTAGE:   { label: '%', icon: Percent },
  FIXED_AMOUNT: { label: '$', icon: DollarSign },
};

export function getStatusBadge(promo) {
  const now = new Date();
  if (!promo.is_active) return { label: 'Inactiva', variant: 'secondary' };
  if (promo.start_date && new Date(promo.start_date) > now) return { label: 'Programada', variant: 'outline' };
  if (promo.end_date   && new Date(promo.end_date)   < now) return { label: 'Vencida',    variant: 'destructive' };
  return { label: 'Activa', variant: 'default' };
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function toLocalDatetimeInput(utcDateStr) {
  if (!utcDateStr) return '';
  const d = new Date(utcDateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function localDatetimeInputToUTC(localStr) {
  if (!localStr) return null;
  const d = new Date(localStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}