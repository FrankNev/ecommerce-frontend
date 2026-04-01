'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) { router.push('/login'); return; }
    if (items.length === 0) { router.push('/cart'); return; }

    setLoading(true);
    try {
      const { data: order } = await ecommerceAPI.post('/api/orders', {
        items: items.map(({ product, quantity }) => ({
          product_id: product._id,
          quantity,
        })),
      });

      const { data: payment } = await ecommerceAPI.post('/api/payments/create-preference', {
        orderId: order.orderId,
        items: order.items,
      });

      clearCart();
      window.location.href = payment.initPoint;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirmar pedido</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Tu pedido</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">
                    {product.name} x{quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    ${(product.price * quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${getTotal().toLocaleString('es-AR')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tus datos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nombre</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
              Vas a ser redirigido a MercadoPago para completar el pago de forma segura.
            </div>
            <Button className="w-full" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}