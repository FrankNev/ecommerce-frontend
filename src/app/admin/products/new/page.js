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

export default function NewProductPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '',
  });

  const [mounted, setMounted] = useState(false);

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

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', stock: '', attributes: [{ key: '', value: '' }] }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariantAttribute = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].attributes.push({ key: '', value: '' });
    setVariants(updated);
  };

  const updateVariantAttribute = (variantIndex, attrIndex, field, value) => {
    const updated = [...variants];
    updated[variantIndex].attributes[attrIndex][field] = value;
    setVariants(updated);
  };

  const removeVariantAttribute = (variantIndex, attrIndex) => {
    const updated = [...variants];
    updated[variantIndex].attributes = updated[variantIndex].attributes.filter((_, i) => i !== attrIndex);
    setVariants(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      // Convertir atributos a formato JSON
      const attributesObj = {};
      attributes.forEach(({ key, value }) => {
        if (key.trim()) attributesObj[key.trim()] = value.trim();
      });
      formData.append('attributes', JSON.stringify(attributesObj));

      images.forEach(img => formData.append('images', img));

      const formattedVariants = variants.map(v => ({
        name: v.name,
        price: Number(v.price),
        stock: Number(v.stock),
        attributes: Object.fromEntries(v.attributes.filter(a => a.key.trim()).map(a => [a.key.trim(), a.value.trim()])),
      }));
      formData.append('variants', JSON.stringify(formattedVariants));

      await ecommerceAPI.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Producto creado correctamente');
      router.push('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Nuevo producto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="iPhone 15" />
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
                  placeholder="Descripción del producto..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="price">Precio</Label>
                  <Input id="price" type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="999999" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" placeholder="10" />
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
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Variantes</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  + Agregar variante
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {variants.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Sin variantes — el producto tendrá un único precio y stock
                </p>
              )}
              {variants.map((variant, vIndex) => (
                <div key={vIndex} className="border border-gray-200 rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Variante {vIndex + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-600"
                      onClick={() => removeVariant(vIndex)}
                    >✕</Button>
                  </div>

                  <div className="space-y-1">
                    <Label>Nombre de la variante</Label>
                    <Input
                      placeholder="Ej: Negro 128GB"
                      value={variant.name}
                      onChange={(e) => updateVariant(vIndex, 'name', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="space-y-1">
                      <Label>Precio</Label>
                      <Input
                        type="number"
                        placeholder="999999"
                        value={variant.price}
                        onChange={(e) => updateVariant(vIndex, 'price', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        placeholder="10"
                        value={variant.stock}
                        onChange={(e) => updateVariant(vIndex, 'stock', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Atributos</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addVariantAttribute(vIndex)}
                      >+ Atributo</Button>
                    </div>
                    {variant.attributes.map((attr, aIndex) => (
                      <div key={aIndex} className="flex gap-2 items-center">
                        <Input
                          placeholder="Ej: Color"
                          value={attr.key}
                          onChange={(e) => updateVariantAttribute(vIndex, aIndex, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Ej: Negro"
                          value={attr.value}
                          onChange={(e) => updateVariantAttribute(vIndex, aIndex, 'value', e.target.value)}
                        />
                        {variant.attributes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-600 shrink-0"
                            onClick={() => removeVariantAttribute(vIndex, aIndex)}
                          >✕</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Imágenes</CardTitle></CardHeader>
            <CardContent className="space-y-4">

              {/* Previews de imágenes seleccionadas */}
              {previews.length > 0 && (
                <div className="space-y-3">
                  {previews.map((url, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
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
                          const newImages = images.filter((_, idx) => idx !== i);
                          const newPreviews = previews.filter((_, idx) => idx !== i);
                          setImages(newImages);
                          setPreviews(newPreviews);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón para agregar imágenes */}
              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                <span className="text-sm text-gray-500">
                  {previews.length > 0 ? '+ Agregar más imágenes' : 'Seleccionar imágenes'}
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
              {loading ? 'Creando...' : 'Crear producto'}
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