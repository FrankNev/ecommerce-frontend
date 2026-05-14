'use client';

import { MapPin, Store } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

export function validateShippingForm(shippingType, addressData) {
  if (shippingType === 'pickup') return null;
  const required = ['direccion', 'numero', 'ciudad', 'provincia', 'codigo_postal'];
  for (const field of required) {
    if (!addressData[field]?.trim()) return 'Completá todos los campos obligatorios de envío';
  }
  return null;
}

const ShippingOption = ({ id, icon: Icon, title, subtitle, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(id)}
    className={`flex items-center gap-4 p-4 w-full rounded-xl border-2 text-left transition-all ${
      selected
        ? 'border-gray-900 bg-gray-50'
        : 'border-gray-200 hover:border-gray-400'
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
      selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
    }`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="font-semibold text-sm text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </button>
);

/**
 * @param {string}   shippingType  - 'home' | 'pickup'
 * @param {Object}   addressData
 * @param {Function} onTypeChange
 * @param {Function} onAddressChange
 * @param {Function} onConfirm
 */
export default function StepShipping({ shippingType, addressData, onTypeChange, onAddressChange, onConfirm }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ShippingOption
          id="home"
          icon={MapPin}
          title="Envío a domicilio"
          subtitle="Entrega en tu dirección"
          selected={shippingType === 'home'}
          onSelect={onTypeChange}
        />
        <ShippingOption
          id="pickup"
          icon={Store}
          title="Retiro en local"
          subtitle="Retirá en nuestro local"
          selected={shippingType === 'pickup'}
          onSelect={onTypeChange}
        />
      </div>

      {shippingType === 'home' && (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <div className="space-y-1">
              <Label htmlFor="s-direccion">Dirección *</Label>
              <Input
                id="s-direccion"
                value={addressData.direccion}
                onChange={e => onAddressChange('direccion', e.target.value)}
                placeholder="Ej.: Av. Corrientes"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-numero">Número *</Label>
              <Input
                id="s-numero"
                value={addressData.numero}
                onChange={e => onAddressChange('numero', e.target.value)}
                placeholder="Ej.: 1234"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-piso">
              Piso / Depto <span className="text-gray-400 font-normal">(opcional)</span>
            </Label>
            <Input
              id="s-piso"
              value={addressData.piso}
              onChange={e => onAddressChange('piso', e.target.value)}
              placeholder="Ej.: 3° B"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="s-ciudad">Ciudad *</Label>
              <Input
                id="s-ciudad"
                value={addressData.ciudad}
                onChange={e => onAddressChange('ciudad', e.target.value)}
                placeholder="Ej.: Buenos Aires"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-cp">Código postal *</Label>
              <Input
                id="s-cp"
                value={addressData.codigo_postal}
                onChange={e => onAddressChange('codigo_postal', e.target.value)}
                placeholder="Ej.: 1001"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-provincia">Provincia *</Label>
            <select
              id="s-provincia"
              value={addressData.provincia}
              onChange={e => onAddressChange('provincia', e.target.value)}
              className="w-full border border-input rounded-none bg-transparent h-8 px-2.5 text-xs focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
            >
              <option value="">Seleccioná una provincia</option>
              {PROVINCIAS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <Button className="w-full mt-2" onClick={onConfirm}>
        Continuar
      </Button>
    </div>
  );
}