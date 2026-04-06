import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const itemKey = product.selectedVariant
          ? `${product._id}_${product.selectedVariant._id}`
          : product._id;

        const existing = items.find(i => i.itemKey === itemKey);
        const maxStock = product.selectedVariant?.stock ?? product.stock;

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, maxStock);
          set({
            items: items.map(i =>
              i.itemKey === itemKey ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({ items: [...items, { itemKey, product, quantity: Math.min(quantity, maxStock) }] });
        }
      },

      removeItem: (itemKey) => {
        set({ items: get().items.filter(i => i.itemKey !== itemKey) });
      },

      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey);
          return;
        }
        const item = get().items.find(i => i.itemKey === itemKey);
        if (!item) return;
        const maxStock = item.product.selectedVariant?.stock ?? item.product.stock;
        set({
          items: get().items.map(i =>
            i.itemKey === itemKey ? { ...i, quantity: Math.min(quantity, maxStock) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.selectedVariant?.price ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCartStore;