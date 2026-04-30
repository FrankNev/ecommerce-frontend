'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

const PREVIEW_PRODUCT = {
  name: 'MacBook Pro 14" M3',
  brand: 'Apple',
  price: 2499999,
};

function calculatePreview(promotion) {
  if (!promotion) return { finalPrice: PREVIEW_PRODUCT.price, discountAmount: 0, discountPercent: '0' };
  const price = PREVIEW_PRODUCT.price;
  let finalPrice = promotion.discount_type === 'PERCENTAGE'
    ? price * (1 - Number(promotion.value) / 100)
    : price - Number(promotion.value);
  finalPrice = Math.max(0, Math.round(finalPrice));
  const discountAmount = price - finalPrice;
  const discountPercent = ((discountAmount / price) * 100).toFixed(1);
  return { finalPrice, discountAmount, discountPercent };
}

export default function PricePreviewDialog({ open, onClose, promotion }) {
  const { finalPrice, discountAmount, discountPercent } = calculatePreview(promotion);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Previsualización de precio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Así se vería el descuento aplicado a un producto de ejemplo.
          </p>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
            <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-1">💻</div>
                <p className="text-xs text-gray-400">Imagen del producto</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{PREVIEW_PRODUCT.brand}</p>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{PREVIEW_PRODUCT.name}</h3>
              <div className="space-y-0.5 pt-1">
                {discountAmount > 0 && (
                  <p className="text-sm text-gray-400 line-through">
                    ${PREVIEW_PRODUCT.price.toLocaleString('es-AR')}
                  </p>
                )}
                <p className="text-xl font-bold text-gray-900">
                  ${finalPrice.toLocaleString('es-AR')}
                </p>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    -{discountPercent}% OFF
                  </span>
                  <span className="text-xs text-gray-500">
                    Ahorrás ${discountAmount.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {promotion && (
            <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1">
              <p className="font-semibold text-gray-700">Promoción aplicada:</p>
              <p className="text-gray-600">{promotion.name}</p>
              <p className="text-gray-500">
                {promotion.discount_type === 'PERCENTAGE'
                  ? `${promotion.value}% de descuento`
                  : `$${Number(promotion.value).toLocaleString('es-AR')} de descuento`
                }
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}