'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const STATUS_LABELS = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'outline' },
  delivered: { label: 'Entregado', variant: 'default' },
  cancelled: { label: 'Destructive', variant: 'destructive' },
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [mounted, user]);

  const fetchData = async () => {
    try {
      const [{ data: prods }, { data: ords }, { data: cats }] = await Promise.all([
        ecommerceAPI.get('/api/products'),
        ecommerceAPI.get('/api/orders'),
        ecommerceAPI.get('/api/categories'),
      ]);
      setProducts(prods.products);
      setOrders(ords);
      setCategories(cats);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await ecommerceAPI.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await ecommerceAPI.put(`/api/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Cargando...
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de administración</h1>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Productos ({products.length})</TabsTrigger>
            <TabsTrigger value="orders">Órdenes ({orders.length})</TabsTrigger>
            <TabsTrigger value="categories">Categorías ({categories.length})</TabsTrigger>
          </TabsList>

          {/* Tab Productos */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Productos</CardTitle>
                  <Button size="sm" onClick={() => router.push('/admin/products/new')}>
                    + Nuevo producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Órdenes */}
          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle>Órdenes</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.user_email}</TableCell>
                        <TableCell>${Number(order.total).toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Categorías */}
          <TabsContent value="categories">
            <Card>
              <CardHeader><CardTitle>Categorías</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>{cat.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}