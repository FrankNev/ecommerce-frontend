'use client';

import { CreditCard, Wallet, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * @param {string|null} paymentMethod     - 'mercadopago' | null
 * @param {string|null} paymentSubMethod  - 'card' | 'account' | null
 * @param {Function}    onMethodChange
 * @param {Function}    onSubMethodChange
 * @param {Object|null} bankInfo
 */
export default function StepPayment({
  paymentMethod,
  paymentSubMethod,
  onMethodChange,
  onSubMethodChange,
  bankInfo,
}) {
  const mpSelected = paymentMethod === 'mercadopago';

  return (
    <div className="space-y-3 pt-2">
      {/* Opción MercadoPago */}
      <button
        type="button"
        onClick={() => onMethodChange('mercadopago')}
        className={`flex items-center gap-4 p-4 w-full rounded-xl border-2 text-left transition-all ${mpSelected
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 hover:border-gray-400'
          }`}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${mpSelected ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
          <img src='https://vectorseek.com/wp-content/uploads/2023/08/Mercado-Pago-Icon-Logo-Vector.svg-.png' alt="Mercado Pago" className='h-5 object-contain' />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-900">MercadoPago</p>
          <p className="text-xs text-gray-500">Seleccioná cómo querés pagar</p>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${mpSelected ? 'rotate-180' : ''}`}
        />
      </button>

      {mpSelected && (
        <div className="ml-4 space-y-2 border-l-2 border-gray-100 pl-4">
          <SubOption
            id="card"
            icon={CreditCard}
            title="Tarjeta Débito / Crédito"
            subtitle="Visa, Mastercard, Amex y más"
            selected={paymentSubMethod === 'card'}
            onSelect={onSubMethodChange}
          />
          <SubOption
            id="account"
            icon={Wallet}
            title="Dinero en cuenta / Transferencia"
            subtitle="Pagá con tu saldo de MercadoPago"
            selected={paymentSubMethod === 'account'}
            onSelect={onSubMethodChange}
            badge={bankInfo?.discountPercent ? `${bankInfo.discountPercent}% OFF` : null}
          />
        </div>
      )}
    </div>
  );
}

function SubOption({ id, icon: Icon, title, subtitle, selected, onSelect, badge }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex items-center gap-3 p-3 w-full rounded-lg border-2 text-left transition-all ${selected
        ? 'border-gray-900 bg-white'
        : 'border-gray-200 hover:border-gray-400 bg-white'
        }`}
    >
      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
        }`}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {badge && (
        <Badge variant="secondary" className="text-green-700 bg-green-100 shrink-0 text-xs">
          {badge}
        </Badge>
      )}
    </button>
  );
}