'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [deletingImage, setDeletingImage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '',
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    fetchProduct();
    ecommerceAPI.get('/api/categories').then(({ data }) => setCategories(data));
  }, [mounted, user]);

  const fetchProduct = async () => {
    try {
      const { id } = await params;
      const { data } = await ecommerceAPI.get(`/api/products/${id}`);
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category_id: data.category_id,
      });
      if (data.attributes) {
        const attrs = Object.entries(data.attributes).map(([key, value]) => ({ key, value }));
        setAttributes(attrs.length > 0 ? attrs : [{ key: '', value: '' }]);
      }
      setExistingImages(data.images || []);
    } catch (error) {
      toast.error('Error al cargar producto');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleDeleteExistingImage = async (publicId, index) => {
    if (!confirm('¿Eliminár esta imagen?')) return;
    setDeletingImage(index);
    try {
      const { id } = await params;
      await ecommerceAPI.delete(`/api/products/${id}/images`, {
        data: { public_id: publicId },
      });
      setExistingImages(existingImages.filter((_, i) => i !== index));
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar imagen');
    } finally {
      setDeletingImage(null);
    }
  };

  const addAttribute = () => setAttributes([...attributes, { key: '', value: '' }]);

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { id } = await params;
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      const attributesObj = {};
      attributes.forEach(({ key, value }) => {
        if (key.trim()) attributesObj[key.trim()] = value.trim();
      });
      formData.append('attributes', JSON.stringify(attributesObj));
      images.forEach(img => formData.append('images', img));

      await ecommerceAPI.put(`/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Producto actualizado correctamente');
      router.push('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        Cargando producto...
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar producto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="price">Precio</Label>
                  <Input id="price" type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="category_id">Categoría</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Seleccioná una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Atributos</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                  + Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    placeholder="Ej: RAM"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="Ej: 8GB"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  />
                  {attributes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttribute(index)}
                      className="text-red-400 hover:text-red-600 shrink-0"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Imágenes</CardTitle></CardHeader>
            <CardContent className="space-y-4">

              {/* Imágenes existentes en Cloudinary */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Imágenes actuales</p>
                  {existingImages.map((img, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={img.url}
                        alt={`Imagen ${i + 1}`}
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 truncate">{img.public_id}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600 shrink-0"
                        disabled={deletingImage === i}
                        onClick={() => handleDeleteExistingImage(img.public_id, i)}
                      >
                        {deletingImage === i ? '...' : '✕'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Previews de nuevas imágenes */}
              {previews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Nuevas imágenes</p>
                  {previews.map((url, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-dashed border-gray-200 rounded-lg">
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{images[i]?.name}</p>
                        <p className="text-xs text-gray-400">{(images[i]?.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600 shrink-0"
                        onClick={() => {
                          setImages(images.filter((_, idx) => idx !== i));
                          setPreviews(previews.filter((_, idx) => idx !== i));
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                <span className="text-sm text-gray-500">
                  {previews.length > 0 || existingImages.length > 0 ? '+ Agregar más imágenes' : 'Seleccionar imágenes'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/admin')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}