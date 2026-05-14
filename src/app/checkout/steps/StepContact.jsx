'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Mirrors the backend ALLOWED_DOMAINS list for frontend pre-validation
const ALLOWED_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.com.ar', 'yahoo.com.br', 'yahoo.es',
  'outlook.com', 'outlook.com.ar', 'outlook.es', 'hotmail.com',
  'hotmail.com.ar', 'hotmail.es', 'live.com', 'live.com.ar',
  'icloud.com', 'me.com', 'mac.com', 'proton.me', 'protonmail.com',
  'tutanota.com', 'tuta.io', 'zoho.com', 'aol.com', 'msn.com',
]);

export function isAllowedEmailDomain(email) {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase();
  return ALLOWED_DOMAINS.has(domain) ||
    [...ALLOWED_DOMAINS].some(d => domain.endsWith('.' + d));
}

export function validateContactForm(data) {
  if (!data.nombre?.trim()) return 'El nombre es requerido';
  if (!data.apellido?.trim()) return 'El apellido es requerido';
  if (!data.email?.trim()) return 'El email es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Ingresá un email válido';
  if (!isAllowedEmailDomain(data.email)) return 'Solo se aceptan emails de proveedores conocidos (Gmail, Outlook, iCloud, etc.)';
  if (!data.dni?.trim()) return 'El DNI es requerido';
  if (!/^\d{7,8}$/.test(data.dni.replace(/\D/g, ''))) return 'El DNI debe tener 7 u 8 dígitos';
  if (!data.telefono?.trim()) return 'El teléfono es requerido';
  return null;
}

/**
 * @param {Object}   data
 * @param {Function} onChange
 * @param {Function} onConfirm
 * @param {Object}   loggedUser
 */
export default function StepContact({ data, onChange, onConfirm, loggedUser }) {
  const emailLocked = !!loggedUser?.email;

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="c-nombre">Nombre *</Label>
          <Input
            id="c-nombre"
            value={data.nombre}
            onChange={e => onChange('nombre', e.target.value)}
            placeholder="Juan"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-apellido">Apellido *</Label>
          <Input
            id="c-apellido"
            value={data.apellido}
            onChange={e => onChange('apellido', e.target.value)}
            placeholder="Pérez"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="c-email">Email *</Label>
        <Input
          id="c-email"
          type="email"
          value={data.email}
          onChange={e => onChange('email', e.target.value)}
          placeholder="juanperez@gmail.com"
          disabled={emailLocked}
          className={emailLocked ? 'bg-gray-50 text-gray-500' : ''}
        />
        {emailLocked && (
          <p className="text-xs text-gray-500">Email de tu cuenta registrada</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="c-dni">DNI *</Label>
          <Input
            id="c-dni"
            value={data.dni}
            onChange={e => onChange('dni', e.target.value)}
            placeholder="Ej.: 12345678"
            maxLength={9}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-telefono">Teléfono *</Label>
          <Input
            id="c-telefono"
            value={data.telefono}
            onChange={e => onChange('telefono', e.target.value)}
            placeholder="Ej.: +54 11 1234-5678"
          />
        </div>
      </div>

      <Button className="w-full mt-2" onClick={onConfirm}>
        Continuar
      </Button>
    </div>
  );
}