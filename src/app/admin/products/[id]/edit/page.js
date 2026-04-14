'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminGuard from '@/components/auth/AdminGuard';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletingImage, setDeletingImage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', brand: '',
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
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        stock: data.stock || '',
        category_id: data.category_id || '',
        brand: data.brand || '',
      });

      if (data.attributes) {
        const attrs = Object.entries(data.attributes).map(([key, value]) => ({ key, value }));
        setAttributes(attrs.length > 0 ? attrs : [{ key: '', value: '' }]);
      }

      if (data.variants && data.variants.length > 0) {
        setHasVariants(true);
        setVariants(data.variants.map(v => ({
          _id: v._id,
          name: v.name,
          price: v.price,
          stock: v.stock,
          attributes: Object.entries(v.attributes || {}).map(([key, value]) => ({ key, value })),
        })));
      }

      setExistingImages(data.images || []);
    } catch (error) {
      toast.error('Error al cargar producto');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Atributos generales
  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };
  const addAttribute = () => setAttributes([...attributes, { key: '', value: '' }]);
  const removeAttribute = (index) => setAttributes(attributes.filter((_, i) => i !== index));

  // Variantes
  const addVariant = () => setVariants([...variants, {
    name: '', price: '', stock: '', attributes: [{ key: '', value: '' }]
  }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };
  const addVariantAttribute = (vIndex) => {
    const updated = [...variants];
    updated[vIndex].attributes.push({ key: '', value: '' });
    setVariants(updated);
  };
  const updateVariantAttribute = (vIndex, aIndex, field, value) => {
    const updated = [...variants];
    updated[vIndex].attributes[aIndex][field] = value;
    setVariants(updated);
  };
  const removeVariantAttribute = (vIndex, aIndex) => {
    const updated = [...variants];
    updated[vIndex].attributes = updated[vIndex].attributes.filter((_, i) => i !== aIndex);
    setVariants(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleDeleteExistingImage = async (publicId, index) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { id } = await params;
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category_id', form.category_id);
      formData.append('brand', form.brand);

      if (!hasVariants) {
        formData.append('price', form.price);
        formData.append('stock', form.stock);
      } else {
        const minPrice = Math.min(...variants.map(v => Number(v.price) || 0));
        formData.append('price', minPrice);
      }

      const attributesObj = {};
      attributes.forEach(({ key, value }) => {
        if (key.trim()) attributesObj[key.trim()] = value.trim();
      });
      formData.append('attributes', JSON.stringify(attributesObj));

      if (hasVariants) {
        const formattedVariants = variants.map(v => ({
          ...(v._id && { _id: v._id }),
          name: v.name,
          price: Number(v.price),
          stock: Number(v.stock),
          attributes: Object.fromEntries(
            v.attributes.filter(a => a.key.trim()).map(a => [a.key.trim(), a.value.trim()])
          ),
        }));
        formData.append('variants', JSON.stringify(formattedVariants));
      }

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

          {/* Información básica */}
          <Card>
            <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" name="brand" value={form.brand} onChange={handleChange} placeholder="Apple" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Descripción *</Label>
                <textarea
                  id="description" name="description" value={form.description}
                  onChange={handleChange} required rows={6}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-y"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category_id">Categoría *</Label>
                <select
                  id="category_id" name="category_id" value={form.category_id}
                  onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Seleccioná una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox" id="hasVariants" checked={hasVariants}
                  onChange={(e) => {
                    setHasVariants(e.target.checked);
                    if (e.target.checked && variants.length === 0) {
                      setVariants([{ name: '', price: '', stock: '', attributes: [{ key: '', value: '' }] }]);
                    }
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="hasVariants" className="cursor-pointer">
                  Este producto tiene variantes
                </Label>
              </div>

              {!hasVariants && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="space-y-1">
                    <Label htmlFor="price">Precio *</Label>
                    <Input id="price" type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input id="stock" type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Especificaciones generales */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Especificaciones generales</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addAttribute}>+ Agregar</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input placeholder="Ej: Pantalla" value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)} />
                  <Input placeholder="Ej: 6.1 pulgadas" value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)} />
                  {attributes.length > 1 && (
                    <Button type="button" variant="ghost" size="sm"
                      className="text-red-400 hover:text-red-600 shrink-0"
                      onClick={() => removeAttribute(index)}>✕</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Variantes */}
          {hasVariants && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Variantes</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Agregar variante</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {variants.map((variant, vIndex) => (
                  <div key={vIndex} className="border border-gray-200 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-700">
                        {variant.name || `Variante ${vIndex + 1}`}
                      </p>
                      <Button type="button" variant="ghost" size="sm"
                        className="text-red-400 hover:text-red-600"
                        onClick={() => removeVariant(vIndex)}>✕</Button>
                    </div>

                    <div className="space-y-1">
                      <Label>Nombre *</Label>
                      <Input placeholder="Ej: Negro 128GB" value={variant.name}
                        onChange={(e) => updateVariant(vIndex, 'name', e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="space-y-1">
                        <Label>Precio *</Label>
                        <Input type="number" placeholder="999999" value={variant.price}
                          onChange={(e) => updateVariant(vIndex, 'price', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>Stock *</Label>
                        <Input type="number" placeholder="10" value={variant.stock}
                          onChange={(e) => updateVariant(vIndex, 'stock', e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Atributos diferenciadores</Label>
                        <Button type="button" variant="ghost" size="sm"
                          onClick={() => addVariantAttribute(vIndex)}>+ Atributo</Button>
                      </div>
                      <p className="text-xs text-gray-400">Ej: Color → Negro, Almacenamiento → 128GB</p>
                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-2 items-center">
                          <Input placeholder="Ej: Color" value={attr.key}
                            onChange={(e) => updateVariantAttribute(vIndex, aIndex, 'key', e.target.value)} />
                          <Input placeholder="Ej: Negro" value={attr.value}
                            onChange={(e) => updateVariantAttribute(vIndex, aIndex, 'value', e.target.value)} />
                          {variant.attributes.length > 1 && (
                            <Button type="button" variant="ghost" size="sm"
                              className="text-red-400 hover:text-red-600 shrink-0"
                              onClick={() => removeVariantAttribute(vIndex, aIndex)}>✕</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Imágenes */}
          <Card>
            <CardHeader><CardTitle>Imágenes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Imágenes actuales</p>
                  {existingImages.map((img, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <img src={img.url} alt={`Imagen ${i + 1}`}
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        className="rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 truncate">{img.public_id}</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm"
                        className="text-red-400 hover:text-red-600 shrink-0"
                        disabled={deletingImage === i}
                        onClick={() => handleDeleteExistingImage(img.public_id, i)}>
                        {deletingImage === i ? '...' : '✕'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {previews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Nuevas imágenes</p>
                  {previews.map((url, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-dashed border-gray-200 rounded-lg">
                      <img src={url} alt={`Preview ${i + 1}`}
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        className="rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{images[i]?.name}</p>
                        <p className="text-xs text-gray-400">{(images[i]?.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm"
                        className="text-red-400 hover:text-red-600 shrink-0"
                        onClick={() => {
                          setImages(images.filter((_, idx) => idx !== i));
                          setPreviews(previews.filter((_, idx) => idx !== i));
                        }}>✕</Button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                <span className="text-sm text-gray-500">
                  {previews.length > 0 || existingImages.length > 0 ? '+ Agregar más imágenes' : 'Seleccionar imágenes'}
                </span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button type="button" className="flex-1 bg-white text-black" onClick={() => router.push('/admin')}>
              Cancelar
            </Button>
          </div>

        </form>
      </div>
    </AdminGuard>
  );
}