'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAddToCart } from '@/hooks/useAddToCart';
import { usePromotions } from '@/hooks/usePromotions';

export default function ProductCard({ product, totalHeight }) {
  const image = product.images?.[0]?.url;
  const isOutOfStock = product.stock === 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const { addToCart } = useAddToCart();
  const { getProductPrice } = usePromotions();

  const { finalPrice, discountAmount, appliedPromotion } = getProductPrice(product);
  const hasDiscount = discountAmount > 0;

  return (
    <div className="group bg-white rounded-2md overflow-hidden shadow-sm hover:shadow-md transition" style={{ minWidth: 200 }}>
      <Link href={`/products/${product._id}`}>
        {/* Imagen */}
        <div className="relative bg-gray-100 overflow-hidden" style={{ height: totalHeight }}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{ width: '100%', height: '110%', objectFit: 'contain' }}
              className="group-hover:scale-105 transition duration-300"
            />
          ) : (
            <img
              src='https://res.cloudinary.com/dh10owmif/image/upload/v1776060127/images_sz53ic.png'
              alt={product.name}
              style={{ width: '100%', height: '110%', objectFit: 'cover' }}
              className="group-hover:scale-105 transition duration-300"
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
          {hasDiscount && !isOutOfStock && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {appliedPromotion.name}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.brand && (
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
          )}
          <h3 className="font-semibold text-gray-900 group-hover:text-black transition line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-2 space-y-0.5">
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">
                ${product.price.toLocaleString('es-AR')}
              </p>
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
          className={`w-full py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2
            ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? 'Sin stock' : hasVariants ? 'Ver opciones' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}