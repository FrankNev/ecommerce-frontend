'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    numero: '',
    piso: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const required = ['nombre', 'apellido', 'telefono', 'direccion', 'numero', 'ciudad', 'provincia', 'codigo_postal'];
    for (const field of required) {
      if (!shipping[field].trim()) {
        toast.error('Completá todos los campos obligatorios de envío');
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    if (items.length === 0) { router.push('/cart'); return; }
    if (!validateShipping()) return;

    setLoading(true);
    try {
      const { data: order } = await ecommerceAPI.post('/api/orders', {
        items: items.map(({ product, quantity, selectedVariant }) => ({
          product_id: product._id,
          quantity,
          variant_id: selectedVariant?._id || null,
        })),
        shipping_data: shipping,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirmar pedido</h1>

      <div
        className="gap-8 items-start"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        }}
      >
        {/* Datos de envío */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Datos de envío</CardTitle></CardHeader>
            <CardContent className="space-y-4">

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="space-y-1">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" name="nombre" value={shipping.nombre} onChange={handleChange} placeholder="Juan" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input id="apellido" name="apellido" value={shipping.apellido} onChange={handleChange} placeholder="Pérez" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input id="telefono" name="telefono" value={shipping.telefono} onChange={handleChange} placeholder="+54 11 1234-5678" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="space-y-1">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input id="direccion" name="direccion" value={shipping.direccion} onChange={handleChange} placeholder="Av. Corrientes" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" name="numero" value={shipping.numero} onChange={handleChange} placeholder="1234" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="piso">Piso / Depto <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <Input id="piso" name="piso" value={shipping.piso} onChange={handleChange} placeholder="3° B" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="space-y-1">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input id="ciudad" name="ciudad" value={shipping.ciudad} onChange={handleChange} placeholder="Buenos Aires" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="codigo_postal">Código postal *</Label>
                  <Input id="codigo_postal" name="codigo_postal" value={shipping.codigo_postal} onChange={handleChange} placeholder="1043" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="provincia">Provincia *</Label>
                <select
                  id="provincia"
                  name="provincia"
                  value={shipping.provincia}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Seleccioná una provincia</option>
                  {PROVINCIAS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

            </CardContent>
          </Card>

          {/* Datos del comprador */}
          <Card>
            <CardHeader><CardTitle>Tus datos</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nombre</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen del pedido */}
        <Card className="h-fit">
          <CardHeader><CardTitle>Resumen del pedido</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-3">
              {items.map(({ product, quantity, selectedVariant }) => (
                <div key={product._id} className="flex justify-between text-sm">
                  <div className="text-gray-600 truncate mr-2">
                    <p className="font-medium">{product.name}</p>
                    {selectedVariant && (
                      <p className="text-xs text-gray-400">{selectedVariant.name}</p>
                    )}
                    <p className="text-xs text-gray-400">x{quantity}</p>
                  </div>
                  <span className="font-medium shrink-0">
                    ${((selectedVariant?.price || product.price) * quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${getTotal().toLocaleString('es-AR')}</span>
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