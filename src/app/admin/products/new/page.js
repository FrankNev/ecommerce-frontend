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
import AdminGuard from '@/components/auth/AdminGuard';
import ImageVariantMapper from '@/components/admin/ImageVariantMapper';

const genId = () => Math.random().toString(36).slice(2, 10);

export default function NewProductPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([]);
  const [imageVariantMap, setImageVariantMap] = useState({});
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', brand: '',
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    ecommerceAPI.get('/api/categories').then(({ data }) => setCategories(data));
  }, [mounted, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };
  const addAttribute = () => setAttributes([...attributes, { key: '', value: '' }]);
  const removeAttribute = (index) => setAttributes(attributes.filter((_, i) => i !== index));

  const addVariant = () => setVariants([...variants, {
    clientId: genId(), name: '', price: '', stock: '',
    attributes: [{ key: '', value: '' }],
  }]);

  const removeVariant = (clientId) => {
    setVariants(variants.filter(v => v.clientId !== clientId));
    // Limpiar referencias en imageVariantMap
    setImageVariantMap(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        next[k] = next[k].filter(id => id !== clientId);
      });
      return next;
    });
  };

  const updateVariant = (clientId, field, value) =>
    setVariants(variants.map(v => v.clientId === clientId ? { ...v, [field]: value } : v));

  const addVariantAttribute = (clientId) =>
    setVariants(variants.map(v =>
      v.clientId === clientId
        ? { ...v, attributes: [...v.attributes, { key: '', value: '' }] }
        : v
    ));

  const updateVariantAttribute = (clientId, aIndex, field, value) =>
    setVariants(variants.map(v =>
      v.clientId === clientId
        ? { ...v, attributes: v.attributes.map((a, i) => i === aIndex ? { ...a, [field]: value } : a) }
        : v
    ));

  const removeVariantAttribute = (clientId, aIndex) =>
    setVariants(variants.map(v =>
      v.clientId === clientId
        ? { ...v, attributes: v.attributes.filter((_, i) => i !== aIndex) }
        : v
    ));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const startIdx = images.length;
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [
      ...prev,
      ...files.map((f, i) => ({
        src: URL.createObjectURL(f),
        label: f.name,
        key: String(startIdx + i),
      })),
    ]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => {
      const removed = prev[idx];
      const next = prev.filter((_, i) => i !== idx);
      return next.map((p, i) => ({ ...p, key: String(i) }));
    });
    setImageVariantMap(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < idx) next[String(ki)] = v;
        else if (ki > idx) next[String(ki - 1)] = v;
      });
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category_id', form.category_id);
      formData.append('brand', form.brand);

      if (!hasVariants) {
        formData.append('price', form.price);
        formData.append('stock', form.stock);
      } else {
        formData.append('price', Math.min(...variants.map(v => Number(v.price) || 0)));
        formData.append('stock', 0);
      }

      const attributesObj = {};
      attributes.forEach(({ key, value }) => {
        if (key.trim()) attributesObj[key.trim()] = value.trim();
      });
      formData.append('attributes', JSON.stringify(attributesObj));

      if (hasVariants) {
        const formattedVariants = variants.map(v => ({
          clientId: v.clientId,
          name: v.name,
          price: Number(v.price),
          stock: Number(v.stock),
          attributes: Object.fromEntries(
            v.attributes.filter(a => a.key.trim()).map(a => [a.key.trim(), a.value.trim()])
          ),
        }));
        formData.append('variants', JSON.stringify(formattedVariants));
      }

      if (hasVariants) {
        formData.append('image_variant_map', JSON.stringify(imageVariantMap));
      }

      images.forEach(img => formData.append('images', img));

      await ecommerceAPI.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Producto creado correctamente');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const mappableVariants = variants.filter(v => v.name.trim());

  return (
    <AdminGuard>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Nuevo producto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Información básica */}
          <Card>
            <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="iPhone 15 Pro" />
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
                  placeholder="Descripción del producto..."
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
                    if (e.target.checked) {
                      setVariants([{ clientId: genId(), name: '', price: '', stock: '', attributes: [{ key: '', value: '' }] }]);
                    } else {
                      setVariants([]);
                      setImageVariantMap({});
                    }
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="hasVariants" className="cursor-pointer">
                  Este producto tiene variantes (color, almacenamiento, etc.)
                </Label>
              </div>

              {!hasVariants && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="space-y-1">
                    <Label htmlFor="price">Precio *</Label>
                    <Input id="price" type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="999999" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input id="stock" type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" placeholder="10" />
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
                  <div key={variant.clientId} className="border border-gray-200 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-700">
                        {variant.name || `Variante ${vIndex + 1}`}
                      </p>
                      <Button type="button" variant="ghost" size="sm"
                        className="text-red-400 hover:text-red-600"
                        onClick={() => removeVariant(variant.clientId)}>✕</Button>
                    </div>

                    <div className="space-y-1">
                      <Label>Nombre *</Label>
                      <Input placeholder="Ej: Negro 128GB" value={variant.name}
                        onChange={(e) => updateVariant(variant.clientId, 'name', e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="space-y-1">
                        <Label>Precio *</Label>
                        <Input type="number" placeholder="999999" value={variant.price}
                          onChange={(e) => updateVariant(variant.clientId, 'price', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>Stock *</Label>
                        <Input type="number" placeholder="10" min="0" value={variant.stock}
                          onChange={(e) => updateVariant(variant.clientId, 'stock', e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Atributos diferenciadores</Label>
                        <Button type="button" variant="ghost" size="sm"
                          onClick={() => addVariantAttribute(variant.clientId)}>+ Atributo</Button>
                      </div>
                      <p className="text-xs text-gray-400">Ej: Color → Negro, Almacenamiento → 128GB</p>
                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-2 items-center">
                          <Input placeholder="Ej: Color" value={attr.key}
                            onChange={(e) => updateVariantAttribute(variant.clientId, aIndex, 'key', e.target.value)} />
                          <Input placeholder="Ej: Negro" value={attr.value}
                            onChange={(e) => updateVariantAttribute(variant.clientId, aIndex, 'value', e.target.value)} />
                          {variant.attributes.length > 1 && (
                            <Button type="button" variant="ghost" size="sm"
                              className="text-red-400 hover:text-red-600 shrink-0"
                              onClick={() => removeVariantAttribute(variant.clientId, aIndex)}>✕</Button>
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
              {previews.length > 0 && (
                <div className="space-y-2">
                  {previews.map((preview, i) => (
                    <div key={preview.key} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <img src={preview.src} alt={preview.label}
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        className="rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{preview.label}</p>
                        <p className="text-xs text-gray-400">{(images[i]?.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm"
                        className="text-red-400 hover:text-red-600 shrink-0"
                        onClick={() => removeImage(i)}>✕</Button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                <span className="text-sm text-gray-500">
                  {previews.length > 0 ? '+ Agregar más imágenes' : 'Seleccionar imágenes'}
                </span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>

              {/* Mapper imagen → variante */}
              {hasVariants && previews.length > 0 && mappableVariants.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <ImageVariantMapper
                    images={previews}
                    variants={mappableVariants}
                    value={imageVariantMap}
                    onChange={setImageVariantMap}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creando...' : 'Crear producto'}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/admin/products')}>
              Cancelar
            </Button>
          </div>

        </form>
      </div>
    </AdminGuard>
  );
}