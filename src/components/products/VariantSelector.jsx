'use client';
 
import { useState, useEffect } from 'react';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import useProductImageStore from '@/store/useProductImageStore';
import { usePromotions } from '@/hooks/usePromotions';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
 
function getAttrs(variant) {
  if (!variant?.attributes) return {};
  if (variant.attributes instanceof Map) return Object.fromEntries(variant.attributes);
  if (typeof variant.attributes === 'object' && !Array.isArray(variant.attributes)) return variant.attributes;
  return {};
}
 
function findImageIndexForVariant(variantId, images) {
  if (!images?.length || !variantId) return null;
  const idx = images.findIndex(img =>
    Array.isArray(img.variant_ids) && img.variant_ids.includes(String(variantId))
  );
  return idx !== -1 ? idx : null;
}
 
export default function VariantSelector({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const user = useAuthStore(state => state.user);
  const { setActiveIndex, reset } = useProductImageStore();
  const { getProductPrice } = usePromotions();
  const router = useRouter();
  const pathname = usePathname();
 
  const hasVariants = product.variants && product.variants.length > 0;
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = hasVariants ? (selectedVariant?.stock ?? 0) : product.stock;
 
  const productForEngine = { ...product, price: currentPrice };
  const { finalPrice, discountAmount, appliedPromotion } = getProductPrice(productForEngine);
  const hasDiscount = discountAmount > 0;
  const finalPriceWithoutIVA = (finalPrice / 1.21).toFixed(2);
 
  useEffect(() => {
    if (hasVariants && product.variants.length === 1) handleVariantSelect(product.variants[0]);
    return () => reset();
  }, []);
 
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    const idx = findImageIndexForVariant(variant._id, product.images);
    if (idx !== null) setActiveIndex(idx);
  };
 
  const variantAttributeKeys = hasVariants
    ? [...new Set(product.variants.flatMap(v => Object.keys(getAttrs(v))))]
    : [];
 
  const getUniqueValues = (key) =>
    [...new Set(product.variants.map(v => getAttrs(v)[key]).filter(Boolean))];
 
  const handleAddToCart = () => {
    if (!user) { toast.error('Debés iniciar sesión para agregar al carrito'); router.push(`/login?redirect=${pathname}`); return; }
    if (hasVariants && !selectedVariant) { toast.error('Seleccioná una variante antes de continuar'); return; }
    if (currentStock === 0) { toast.error('Producto sin stock'); return; }
    addItem({ ...product, selectedVariant }, quantity);
    toast.success('Producto agregado al carrito');
  };
 
  return (
    <div className="space-y-5">
 
      {/* Precio producto */}
      <div className="space-y-1">
        {hasDiscount && (
          <p className="text-xl text-gray-400 line-through">
            ${Number(currentPrice).toLocaleString('es-AR')}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <p className={`text-4xl font-bold ${hasDiscount ? 'text-green-600' : 'text-gray-900'}`}>
            ${Number(finalPrice).toLocaleString('es-AR')}
          </p>
          {hasDiscount && appliedPromotion && (
            <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
              {appliedPromotion.name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">
          Precio sin IVA: ${Number(finalPriceWithoutIVA).toLocaleString('es-AR')}
        </p>
      </div>
 
      <Badge variant={currentStock > 0 ? 'default' : 'destructive'}>
        {hasVariants && !selectedVariant ? 'Seleccioná una variante' : currentStock > 0 ? `${currentStock} disponibles` : 'Sin stock'}
      </Badge>
 
      <Separator />
 
      {hasVariants && variantAttributeKeys.length > 0 && (
        <div className="space-y-4">
          {variantAttributeKeys.map(attrKey => (
            <div key={attrKey} className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 capitalize">{attrKey}</p>
              <div className="flex flex-wrap gap-2">
                {getUniqueValues(attrKey).map(value => {
                  const matchingVariant = product.variants.find(v => getAttrs(v)[attrKey] === value);
                  const isSelected = selectedVariant ? getAttrs(selectedVariant)[attrKey] === value : false;
                  const isOutOfStock = (matchingVariant?.stock ?? 0) === 0;
                  return (
                    <button
                      key={value}
                      onClick={() => !isOutOfStock && handleVariantSelect(matchingVariant)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                        isSelected ? 'bg-black text-white border-black'
                        : isOutOfStock ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                        : 'border-gray-300 text-gray-700 hover:border-black hover:text-black'
                      }`}
                    >{value}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
 
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Cantidad</label>
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition">−</button>
          <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
          <button onClick={() => setQuantity(q => Math.min(currentStock || 1, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition">+</button>
        </div>
      </div>
 
      <Button className="w-full" onClick={handleAddToCart} disabled={currentStock === 0 || (hasVariants && !selectedVariant)}>
        <ShoppingCart size={16} />
        {currentStock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </Button>
    </div>
  );
}