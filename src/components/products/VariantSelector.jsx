'use client';

import { useState, useEffect } from 'react';
import useProductImageStore from '@/store/useProductImageStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAddToCart } from '@/hooks/useAddToCart';

const COLOR_KEYS = ['color', 'colour', 'Color', 'Colour', 'COLOR'];

function getAttrs(variant) {
  if (!variant?.attributes) return {};
  if (variant.attributes instanceof Map) return Object.fromEntries(variant.attributes);
  if (typeof variant.attributes === 'object' && !Array.isArray(variant.attributes)) {
    return variant.attributes;
  }
  return {};
}

function getColorValue(variant) {
  const attrs = getAttrs(variant);
  for (const key of COLOR_KEYS) {
    if (attrs[key]) return attrs[key];
  }
  return null;
}

function findImageIndexForColor(colorValue, images, variants) {
  if (!images || images.length === 0) return 0;

  const normalize = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const normalizedColor = normalize(colorValue);

  // Intento 1: match por nombre en URL o public_id
  const urlMatch = images.findIndex((img) => {
    const haystack = normalize(img.url + ' ' + (img.public_id || ''));
    return haystack.includes(normalizedColor);
  });
  if (urlMatch !== -1) return urlMatch;

  // Intento 2: índice de la primera variante con ese color
  const firstVariantIndex = variants.findIndex(
    (v) => normalize(getColorValue(v) || '') === normalizedColor
  );
  if (firstVariantIndex !== -1) return Math.min(firstVariantIndex, images.length - 1);

  return 0;
}

export default function VariantSelector({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { setActiveIndex, reset } = useProductImageStore();
  const { addToCart } = useAddToCart();

  const hasVariants = product.variants && product.variants.length > 0;

  const currentPrice = selectedVariant?.price ?? product.price;
  const priceWithoutIVA = (currentPrice / 1.21).toFixed(2);
  const currentStock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : product.stock;

  useEffect(() => {
    if (hasVariants && product.variants.length === 1) {
      handleVariantSelect(product.variants[0], null);
    }
    return () => reset();
  }, []);

  const handleVariantSelect = (newVariant, prevVariant) => {
    const prevColor = getColorValue(prevVariant ?? selectedVariant);
    const newColor = getColorValue(newVariant);

    setSelectedVariant(newVariant);
    setQuantity(1);

    if (newColor && newColor !== prevColor) {
      const idx = findImageIndexForColor(newColor, product.images, product.variants);
      setActiveIndex(idx);
    }
  };

  const variantAttributeKeys = hasVariants
    ? [...new Set(product.variants.flatMap(v => Object.keys(getAttrs(v))))]
    : [];

  const getUniqueValues = (key) =>
    [...new Set(product.variants.map(v => getAttrs(v)[key]).filter(Boolean))];

  const handleAddToCart = () => {
    addToCart(product, quantity, hasVariants ? selectedVariant : null);
  };

  return (
    <div className="space-y-5">

      {/* Precio */}
      <div>
        <p className="text-4xl font-bold text-gray-900">
          ${Number(currentPrice).toLocaleString('es-AR')}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Precio sin IVA: ${Number(priceWithoutIVA).toLocaleString('es-AR')}
        </p>
      </div>

      {/* Stock */}
      <Badge variant={currentStock > 0 ? 'default' : 'destructive'}>
        {hasVariants && !selectedVariant
          ? 'Seleccioná una variante'
          : currentStock > 0
            ? `${currentStock} disponibles`
            : 'Sin stock'}
      </Badge>

      <Separator />

      {/* Selector de variantes */}
      {hasVariants && variantAttributeKeys.length > 0 && (
        <div className="space-y-4">
          {variantAttributeKeys.map(attrKey => (
            <div key={attrKey} className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 capitalize">{attrKey}</p>
              <div className="flex flex-wrap gap-2">
                {getUniqueValues(attrKey).map(value => {
                  const matchingVariant = product.variants.find(v =>
                    getAttrs(v)[attrKey] === value
                  );
                  const isSelected = selectedVariant
                    ? getAttrs(selectedVariant)[attrKey] === value
                    : false;
                  const isOutOfStock = (matchingVariant?.stock ?? 0) === 0;

                  return (
                    <button
                      key={value}
                      onClick={() => !isOutOfStock && handleVariantSelect(matchingVariant)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isSelected
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
            onClick={() => setQuantity(q => Math.min(currentStock || 1, q + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >+</button>
        </div>
      </div>

      {/* Botón agregar */}
      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={currentStock === 0 || (hasVariants && !selectedVariant)}
      >
        {currentStock === 0 ? 'Elija una variante' : 'Agregar al carrito'}
      </Button>

    </div>
  );
}