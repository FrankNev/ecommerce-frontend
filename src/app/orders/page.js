'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ecommerceAPI } from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_LABELS = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'outline' },
  delivered: { label: 'Entregado', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.push('/login'); return; }
    fetchOrders();
  }, [mounted, user]);

  const fetchOrders = async () => {
    try {
      const { data } = await ecommerceAPI.get('/api/orders/my-orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        Cargando órdenes...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis órdenes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 mb-6">Todavía no tenés órdenes</p>
          <Button onClick={() => router.push('/products')}>Ver productos</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Orden #{order.id}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge variant={STATUS_LABELS[order.status]?.variant}>
                    {STATUS_LABELS[order.status]?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
                      <span className="font-medium">${(item.unit_price * item.quantity).toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${Number(order.total).toLocaleString('es-AR')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}