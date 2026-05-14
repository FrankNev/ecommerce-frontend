'use client';

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function OrderSummary({
  items,
  promotions,
  rawTotal,
  promoTotal,
  transferDiscount,
  bankInfo,
  paymentSubMethod,
  finalTotal,
  calculateFinalPrice,
  loading,
  onSubmit,
  canSubmit,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-fit sticky top-24">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-sm text-gray-900">Resumen del pedido</h2>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map(({ product, quantity, itemKey }) => {
            const baseUnitPrice = product.selectedVariant?.price ?? product.price;
            const productForEngine = { ...product, price: baseUnitPrice };
            const { finalPrice: fp } = calculateFinalPrice(productForEngine, promotions, { cartTotal: rawTotal });
            const hasDiscount = fp < baseUnitPrice;

            return (
              <div key={itemKey} className="flex justify-between text-sm gap-2">
                <div className="text-gray-600 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  {product.selectedVariant && (
                    <p className="text-xs text-gray-400">{product.selectedVariant.name}</p>
                  )}
                  <p className="text-xs text-gray-400">x{quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  {hasDiscount && (
                    <p className="text-xs text-gray-400 line-through">
                      ${(baseUnitPrice * quantity).toLocaleString('es-AR')}
                    </p>
                  )}
                  <p className={`font-medium ${hasDiscount ? 'text-green-600' : 'text-gray-900'}`}>
                    ${(fp * quantity).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {promoTotal < rawTotal && (
          <div className="text-xs text-green-600 font-medium flex justify-between">
            <span>Descuento de promoción</span>
            <span>-${(rawTotal - promoTotal).toLocaleString('es-AR')}</span>
          </div>
        )}

        {paymentSubMethod === 'account' && bankInfo && (
          <>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${promoTotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-xs text-green-600 font-medium items-center gap-2">
              <span className="flex items-center gap-1.5">
                Descuento pago digital
                <Badge variant="secondary" className="text-green-700 bg-green-100 text-xs">
                  -{bankInfo.discountPercent}%
                </Badge>
              </span>
              <span>-${transferDiscount.toLocaleString('es-AR')}</span>
            </div>
          </>
        )}

        <Separator />

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>${Math.round(finalTotal).toLocaleString('es-AR')}</span>
        </div>

        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={loading || !canSubmit}
        >
          {loading
            ? 'Procesando...'
            : paymentSubMethod === 'account'
              ? 'Pagar con Dinero en cuenta'
              : 'Pagar con MercadoPago'
          }
        </Button>

        {!canSubmit && (
          <p className="text-xs text-gray-400 text-center">
            Completá todos los pasos para continuar
          </p>
        )}
      </div>
    </div>
  );
}