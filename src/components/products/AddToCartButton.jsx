'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const handleAdd = () => {
    if (!user) {
      toast.error('Debés iniciar sesión para agregar al carrito');
      router.push('/login');
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

      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  );
}