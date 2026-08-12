'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAddToCart } from '@/hooks/useAddToCart';
import { usePromotions } from '@/hooks/usePromotions';

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;
  const isOutOfStock = product.stock === 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const { addToCart } = useAddToCart();
  const { getProductPrice } = usePromotions();

  const { finalPrice, discountAmount, appliedPromotion } = getProductPrice(product);
  const hasDiscount = discountAmount > 0;

  return (
    <div className="group bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition min-w-[180px]">
      <Link href={`/products/${product._id}`} prefetch={false}>
        {/* Imagen */}
        <div className="relative bg-gray-100 overflow-hidden w-full h-[180px] md:h-[200px]">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
            />
          ) : (
            <img
              src='https://res.cloudinary.com/dh10owmif/image/upload/v1776060127/images_sz53ic.png'
              alt="Este producto no tiene imagen"
              className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                Sin stock
              </span>
            </div>
          )}

          {/* Badge promoción */}
          {hasDiscount && appliedPromotion && !isOutOfStock && (
            <div className="absolute top-2 left-2 z-10">
              <span
                className="text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                style={{
                  backgroundColor: product.badgeColor || '#ef4444'
                }}
              >
                {appliedPromotion.name}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-gray-900 group-hover:text-black transition line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-2 space-y-0.5">
            {hasDiscount && (
              <div className="flex items-center">
                <p className="text-sm text-gray-400 line-through mr-2">
                  ${product.price.toLocaleString('es-AR')}
                </p>
                <span
                  className="text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                  style={{
                    backgroundColor: product.badgeColor || '#ef4444'
                  }}
                >
                  {appliedPromotion.discount_type === 'PERCENTAGE'
                    ? `-${Math.trunc(appliedPromotion.value)}%`
                    : `-$${appliedPromotion.value}`
                  }
                </span>
              </div>
            )}
            <p className={`text-md font-semibold ${hasDiscount ? 'text-green-600' : 'text-gray-900'}`}>
              ${finalPrice.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </Link>

      {/* Botón compra/ver variantes*/}
      <div className="px-4 pb-4">
        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className={`w-full p-2 rounded-md text-sm font-semibold transition flex items-center justify-center gap-2
            ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-700 cursor-pointer'
            }`}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? 'Sin stock' : hasVariants ? 'Ver opciones' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}