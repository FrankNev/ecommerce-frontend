'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_LABELS = {
  pending:   { label: 'Pendiente',  variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  shipped:   { label: 'Enviado',    variant: 'outline' },
  delivered: { label: 'Entregado',  variant: 'default' },
  cancelled: { label: 'Cancelado',  variant: 'destructive' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchOrder, setSearchOrder] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await ecommerceAPI.get('/api/orders');
      setOrders(data);
    } catch {
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await ecommerceAPI.put(`/api/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.')) return;
    try {
      await ecommerceAPI.delete(`/api/orders/${orderId}`);
      setOrders(orders.filter(o => o.id !== orderId));
      setExpandedOrderId(null);
      toast.success('Orden eliminada');
    } catch {
      toast.error('Error al eliminar orden');
    }
  };

  const filteredOrders = orders.filter(order => {
    const term = searchOrder.toLowerCase();
    return (
      order.id.toString().includes(term) ||
      order.user_email.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <div className="py-16 text-center text-gray-400 text-sm">Cargando órdenes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Órdenes ({orders.length})</CardTitle>
          <Input
            placeholder="Buscar por número o email..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            {searchOrder ? 'Sin resultados para esa búsqueda' : 'No hay órdenes aún'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="border border-gray-200 rounded-md">
                {/* Fila de resumen */}
                <button
                  onClick={() =>
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-1 justify-between text-left min-w-0 gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">Orden #{order.id}</p>
                      <p className="text-xs text-gray-500 truncate">{order.user_email}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-semibold text-sm">
                          ${Number(order.total).toLocaleString('es-AR')}
                        </p>
                      </div>
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleUpdateOrderStatus(order.id, e.target.value);
                        }}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      {expandedOrderId === order.id
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </div>
                </button>

                {/* Detalles expandidos */}
                {expandedOrderId === order.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-6">
                    {/* Fecha, estado, pago, envío */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Fecha</p>
                      <p className="text-sm">
                        {new Date(order.created_at).toLocaleDateString('es-AR', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Estado</p>
                        <Badge variant={STATUS_LABELS[order.status]?.variant ?? 'secondary'}>
                          {STATUS_LABELS[order.status]?.label ?? order.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Método de pago</p>
                        <Badge>
                          {order.payment_method === 'transfer' ? 'Transferencia' : 'Mercado Pago'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Envío</p>
                        <Badge variant={order.shipping_data?.shipping_type === 'pickup' ? 'secondary' : 'default'}>
                          {order.shipping_data?.shipping_type === 'pickup'
                            ? 'Retiro en local'
                            : 'Envío a domicilio'}
                        </Badge>
                      </div>
                    </div>

                    {/* Datos de transferencia */}
                    {order.payment_method === 'transfer' && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                          Datos de transferencia
                        </p>
                        <p className="text-sm">N° Comprobante: {order.transfer_receipt}</p>
                        <p className="text-sm">N° Contacto: {order.contact_phone}</p>
                      </div>
                    )}

                    {/* Productos */}
                    <div>
                      <p className="text-sm font-semibold mb-2">
                        Productos ({order.items?.length || 0})
                      </p>
                      <div className="bg-white rounded border border-gray-200">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Producto</TableHead>
                              <TableHead className="text-xs text-center">Cant.</TableHead>
                              <TableHead className="text-xs text-right">P. Unit.</TableHead>
                              <TableHead className="text-xs text-right">Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items?.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-sm">
                                  <p className="font-medium">{item.product_name}</p>
                                  {item.variant_name && (
                                    <p className="text-xs text-gray-400">{item.variant_name}</p>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm text-center">{item.quantity}</TableCell>
                                <TableCell className="text-sm text-right">
                                  ${Number(item.unit_price).toLocaleString('es-AR')}
                                </TableCell>
                                <TableCell className="text-sm text-right font-semibold">
                                  ${(item.unit_price * item.quantity).toLocaleString('es-AR')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Datos de envío */}
                    {order.shipping_data && order.shipping_data.shipping_type !== 'pickup' && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Datos de envío</p>
                        <div className="bg-white rounded border border-gray-200 overflow-hidden">
                          <Table>
                            <TableBody>
                              {[
                                ['Nombre', order.shipping_data.nombre],
                                ['Apellido', order.shipping_data.apellido],
                                ['Teléfono', order.shipping_data.telefono],
                                ['Dirección', order.shipping_data.direccion],
                                ['Número', order.shipping_data.numero],
                                ['Piso', order.shipping_data.piso],
                                ['Ciudad', order.shipping_data.ciudad],
                                ['Provincia', order.shipping_data.provincia],
                                ['Código Postal', order.shipping_data.codigo_postal],
                              ]
                                .filter(([, v]) => v)
                                .map(([label, value]) => (
                                  <TableRow key={label}>
                                    <TableCell className="text-xs font-semibold text-gray-400 bg-gray-50 w-32">
                                      {label}
                                    </TableCell>
                                    <TableCell className="text-sm">{value}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Eliminar orden
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}