'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const handleAdd = () => {
    if (!user) {
      toast.error('Debés iniciar sesión para agregar al carrito');
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    if (product.stock === 0) {
      toast.error('Producto sin stock');
      return;
    }
    addItem(product, quantity);
    toast.success('Producto agregado al carrito');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Cantidad</label>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
      </div>

      <Button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="w-full"
      >
        {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </Button>
    </div>
  );
}