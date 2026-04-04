'use client';

import { useState, useEffect } from 'react';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function VariantSelector({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const hasVariants = product.variants && product.variants.length > 0;

  // Precio y stock actuales según variante seleccionada
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : product.stock;

  // Si solo hay una variante, seleccionarla automáticamente
  useEffect(() => {
    if (hasVariants && product.variants.length === 1) {
      setSelectedVariant(product.variants[0]);
    }
  }, []);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Debés iniciar sesión para agregar al carrito');
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    if (hasVariants && !selectedVariant) {
      toast.error('Seleccioná una variante antes de continuar');
      return;
    }
    if (currentStock === 0) {
      toast.error('Producto sin stock');
      return;
    }
    addItem({ ...product, selectedVariant }, quantity);
    toast.success('Producto agregado al carrito');
  };

  // Agrupar variantes por atributo para mostrar selectores
  const getUniqueAttributeValues = (attributeKey) => {
    return [...new Set(
      product.variants.map(v => v.attributes?.[attributeKey]).filter(Boolean)
    )];
  };

  // Obtener atributos disponibles en las variantes
  const variantAttributeKeys = hasVariants
    ? [...new Set(product.variants.flatMap(v => [...(v.attributes?.keys?.() || [])]))]
    : [];

  return (
    <div className="space-y-5">

      {/* Precio actual */}
      <p className="text-4xl font-bold text-gray-900">
        ${currentPrice.toLocaleString('es-AR')}
      </p>

      {/* Stock */}
      <Badge variant={currentStock > 0 ? 'default' : 'destructive'}>
        {hasVariants && !selectedVariant
          ? 'Seleccioná una variante'
          : currentStock > 0
            ? `${currentStock} disponibles`
            : 'Sin stock'}
      </Badge>

      {/* Selector de variantes */}
      {hasVariants && (
        <div className="space-y-4">
          {variantAttributeKeys.map(attrKey => (
            <div key={attrKey} className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 capitalize">{attrKey}</p>
              <div className="flex flex-wrap gap-2">
                {getUniqueAttributeValues(attrKey).map(value => {
                  const matchingVariant = product.variants.find(
                    v => v.attributes?.[attrKey] === value
                  );
                  const isSelected = selectedVariant?.attributes?.[attrKey] === value;
                  const isOutOfStock = matchingVariant?.stock === 0;

                  return (
                    <button
                      key={value}
                      onClick={() => !isOutOfStock && setSelectedVariant(matchingVariant)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : isOutOfStock
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                            : 'border-gray-300 text-gray-700 hover:border-black hover:text-black'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selector de cantidad */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Cantidad</label>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >−</button>
          <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >+</button>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={currentStock === 0 || (hasVariants && !selectedVariant)}
        >
          {currentStock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </div>

    </div>
  );
}