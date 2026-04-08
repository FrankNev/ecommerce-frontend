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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchOrder, setSearchOrder] = useState('');
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

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.')) return;
    try {
      await ecommerceAPI.delete(`/api/orders/${orderId}`);
      setOrders(orders.filter(o => o.id !== orderId));
      setExpandedOrderId(null);
      toast.success('Orden eliminada');
    } catch (error) {
      toast.error('Error al eliminar orden');
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchTerm = searchOrder.toLowerCase();
    return (
      order.id.toString().includes(searchTerm) ||
      order.user_email.toLowerCase().includes(searchTerm)
    );
  });

  const handleOpenDialog = (category = null) => {
    if (category) {
      setCategoryForm({ name: category.name, description: category.description });
      setIsEditingId(category.id);
    } else {
      setCategoryForm({ name: '', description: '' });
      setIsEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCategoryForm({ name: '', description: '' });
    setIsEditingId(null);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    try {
      if (isEditingId) {
        await ecommerceAPI.put(`/api/categories/${isEditingId}`, categoryForm);
        setCategories(categories.map(c => c.id === isEditingId ? { ...c, ...categoryForm } : c));
        toast.success('Categoría actualizada');
      } else {
        const { data } = await ecommerceAPI.post('/api/categories', categoryForm);
        setCategories([...categories, data]);
        toast.success('Categoría creada');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar categoría');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await ecommerceAPI.delete(`/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Categoría eliminada');
    } catch (error) {
      toast.error('Error al eliminar categoría');
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
              <CardHeader>
                <CardTitle>Órdenes</CardTitle>
                <div className="mt-4">
                  <Input
                    placeholder="Buscar por número de orden o email..."
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay órdenes que coincidan con la búsqueda</p>
                  ) : (
                    filteredOrders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <div className="flex-1">
                              <p className="font-medium">Orden #{order.id}</p>
                              <p className="text-sm text-gray-500">{order.user_email}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-semibold">${Number(order.total).toLocaleString('es-AR')}</p>
                              </div>
                              <select
                                value={order.status}
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
                              {expandedOrderId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </button>

                        {/* Detalles expandidos */}
                        {expandedOrderId === order.id && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Fecha</p>
                                <p className="text-sm">{new Date(order.created_at).toLocaleDateString('es-AR', {
                                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Estado</p>
                                <Badge variant="default" className="w-fit mt-1">
                                  {STATUS_LABELS[order.status]?.label || order.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Método de Pago</p>
                                <Badge className="w-fit mt-1" variant={order.payment_method === 'transfer' ? 'secondary' : 'default'}>
                                  {order.payment_method === 'transfer' ? 'Transferencia' : 'Mercado Pago'}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Tipo de Envío</p>
                                <Badge className="w-fit mt-1" variant={order.shipping_data?.shipping_type === 'pickup' ? 'secondary' : 'default'}>
                                  {order.shipping_data?.shipping_type === 'pickup' ? 'Retiro en Local' : 'Envío a Domicilio'}
                                </Badge>
                              </div>
                            </div>
                            <div className="mb-6">
                              <p className="text-sm font-semibold mb-3">Productos ({order.items?.length || 0})</p>
                              <div className="bg-white rounded border border-gray-200">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-xs">Producto</TableHead>
                                      <TableHead className="text-xs text-center">Cantidad</TableHead>
                                      <TableHead className="text-xs text-right">Precio Unit.</TableHead>
                                      <TableHead className="text-xs text-right">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.items?.map((item, idx) => (
                                      <TableRow key={idx} className="hover:bg-gray-50">
                                        <TableCell className="text-sm">
                                          <div>
                                            <p className="font-medium">{item.product_name}</p>
                                            {item.variant_name && <p className="text-xs text-gray-500">{item.variant_name}</p>}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-sm text-right">${Number(item.unit_price).toLocaleString('es-AR')}</TableCell>
                                        <TableCell className="text-sm text-right font-semibold">
                                          ${(item.unit_price * item.quantity).toLocaleString('es-AR')}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Datos de envío en tabla */}
                            {order.shipping_data && (
                              <div className="mb-6">
                                <p className="text-sm font-semibold mb-3">Datos de envío</p>
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <Table>
                                    <TableBody>
                                      {order.shipping_data.nombre && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Nombre</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.nombre}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.apellido && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Apellido</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.apellido}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.telefono && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Teléfono</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.telefono}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.direccion && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Dirección</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.direccion}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.numero && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Número</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.numero}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.piso && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Piso</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.piso}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.ciudad && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Ciudad</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.ciudad}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.provincia && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Provincia</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.provincia}</TableCell>
                                        </TableRow>
                                      )}
                                      {order.shipping_data.codigo_postal && (
                                        <TableRow className="hover:bg-gray-50">
                                          <TableCell className="text-xs font-semibold text-gray-500 bg-gray-100">Código Postal</TableCell>
                                          <TableCell className="text-sm">{order.shipping_data.codigo_postal}</TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}

                            {/* Botón eliminar */}
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Categorías */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Categorías</CardTitle>
                  <Button size="sm" onClick={() => handleOpenDialog()}>
                    + Nueva categoría
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>{cat.description}</TableCell>
                        <TableCell className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(cat)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCategory(cat.id)}
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
        </Tabs>

        {/* Modal para crear/editar categoría */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditingId ? 'Editar categoría' : 'Nueva categoría'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Electrónica, Ropa, etc."
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Descripción de la categoría..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCategory}>
                {isEditingId ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}