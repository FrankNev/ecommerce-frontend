'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { usePromotions } from '@/hooks/usePromotions';
import { calculateFinalPrice } from '@/lib/priceEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Trash2,
} from 'lucide-react';

function resolveCartImage(product) {
  const variant = product.selectedVariant;
  if (variant && product.images?.length) {
    const match = product.images.find(
      img => Array.isArray(img.variant_ids) && img.variant_ids.includes(String(variant._id))
    );
    if (match) return match.url;
  }
  return product.images?.[0]?.url ?? null;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const user = useAuthStore(state => state.user);
  const { promotions } = usePromotions();

  const rawTotal = getTotal();

  const getFinalUnitPrice = (product) => {
    const productForEngine = {
      ...product,
      price: product.selectedVariant?.price ?? product.price,
    };
    const { finalPrice } = calculateFinalPrice(productForEngine, promotions, { cartTotal: rawTotal });
    return finalPrice;
  };

  const discountedTotal = items.reduce((acc, { product, quantity }) => {
    return acc + getFinalUnitPrice(product) * quantity;
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Debés iniciar sesión para continuar');
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Agregá productos para continuar</p>
        <Button onClick={() => router.push('/products')}>Ver productos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, itemKey }) => {
            const imageUrl = resolveCartImage(product);
            const baseUnitPrice = product.selectedVariant?.price ?? product.price;
            const finalUnitPrice = getFinalUnitPrice(product);
            const hasDiscount = finalUnitPrice < baseUnitPrice;

            return (
              <Card key={itemKey}>
                <CardContent className="p-5 flex gap-5">
                  <div
                    style={{ position: 'relative', height: '96px', width: '96px', overflow: 'hidden' }}
                    className="bg-gray-100 rounded-xl shrink-0"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    {product.selectedVariant && (
                      <p className="text-sm text-gray-500">{product.selectedVariant.name}</p>
                    )}

                    {/* Precio unitario — tachado si tiene descuento */}
                    <div className="mt-1">
                      {hasDiscount && (
                        <p className="text-xs text-gray-400 line-through">
                          ${baseUnitPrice.toLocaleString('es-AR')} c/u
                        </p>
                      )}
                      <p className={`text-sm ${hasDiscount ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                        ${finalUnitPrice.toLocaleString('es-AR')} c/u
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(itemKey, Math.max(1, quantity - 1))}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm"
                        >−</button>
                        <span className="px-3 py-1.5 text-sm font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemKey, quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm"
                        >+</button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className={`font-bold ${hasDiscount ? 'text-green-600' : 'text-gray-900'}`}>
                          ${(finalUnitPrice * quantity).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost" size="sm"
                    className="text-gray-900"
                    onClick={() => removeItem(itemKey)}
                  >
                    <Trash2 />
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          <Button variant="ghost" size="sm" className="text-gray-900 hover:text-red-600" onClick={clearCart}>
            Vaciar carrito
          </Button>
        </div>

        {/* Resumen */}
        <Card className="h-fit">
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              {items.map(({ product, quantity, itemKey }) => {
                const baseUnitPrice = product.selectedVariant?.price ?? product.price;
                return (
                  <div key={itemKey} className="flex justify-between text-gray-500">
                    <span className="truncate mr-2">
                      {product.name}
                      {product.selectedVariant && ` (${product.selectedVariant.name})`}
                      {` x${quantity}`}
                    </span>
                    <span>${(baseUnitPrice * quantity).toLocaleString('es-AR')}</span>
                  </div>
                );
              })}
            </div>

            {/* Si aplica un descuento, muestra el ahorro */}
            {discountedTotal < rawTotal && (
              <div className="text-xs text-green-600 font-medium flex justify-between border-t pt-2">
                <span>Descuento aplicado</span>
                <span>-${(rawTotal - discountedTotal).toLocaleString('es-AR')}</span>
              </div>
            )}

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${discountedTotal.toLocaleString('es-AR')}</span>
            </div>

            <Button className="w-full" onClick={handleCheckout}>
              Continuar con el pago
            </Button>

            <Button variant="ghost" className="w-full text-gray-500 bg-color-gray" asChild>
              <Link href="/products">Seguir comprando</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}