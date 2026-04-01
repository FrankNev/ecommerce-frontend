'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const user = useAuthStore(state => state.user);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Debés iniciar sesión para continuar');
      router.push('/login');
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
          {items.map(({ product, quantity }) => (
            <Card key={product._id}>
              <CardContent className="p-5 flex gap-5">
                <div style={{ position: 'relative', height: '96px', width: '96px', overflow: 'hidden' }}
                  className="bg-gray-100 rounded-xl shrink-0">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    ${product.price.toLocaleString('es-AR')} c/u
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product._id, Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm"
                      >−</button>
                      <span className="px-3 py-1.5 text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-sm"
                      >+</button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-bold text-gray-900">
                        ${(product.price * quantity).toLocaleString('es-AR')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600"
                        onClick={() => removeItem(product._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="ghost" size="sm" className="text-gray-400" onClick={clearCart}>
            Vaciar carrito
          </Button>
        </div>

        {/* Resumen */}
        <Card className="h-fit">
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex justify-between text-gray-500">
                  <span className="truncate mr-2">{product.name} x{quantity}</span>
                  <span>${(product.price * quantity).toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${getTotal().toLocaleString('es-AR')}</span>
            </div>

            <Button className="w-full" onClick={handleCheckout}>
              Continuar con el pago
            </Button>

            <Button variant="ghost" className="w-full text-gray-500" asChild>
              <Link href="/products">Seguir comprando</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}