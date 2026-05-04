'use client';

import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import useCartStore from '@/store/useCartStore';

export function useAddToCart() {
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    const hasVariants = product.variants && product.variants.length > 0;

    // Si tiene variantes y no se seleccionó ninguna, redirigir al detalle
    if (hasVariants && !selectedVariant) {
      router.push(`/products/${product._id}`);
      return;
    }

    const stock = selectedVariant?.stock ?? product.stock;
    if (stock === 0) {
      toast.error('Producto sin stock');
      return;
    }

    addItem({ ...product, selectedVariant }, quantity);
    toast.success('Producto agregado al carrito');
  };

  return { addToCart };
}