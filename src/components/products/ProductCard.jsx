import Link from 'next/link';

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;
  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-2md overflow-hidden shadow-sm hover:shadow-md transition">

        {/* Imagen */}
        <div className="relative bg-gray-100 overflow-hidden" style={{ height: '200px' }}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              📦
            </div>
          )}

          {/* Badge sin stock sobre la imagen */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                Sin stock
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
          <p className="text-lg font-bold text-gray-900 mt-2">
            ${product.price.toLocaleString('es-AR')}
          </p>
          {product.variants?.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">{product.variants.length} variantes disponibles</p>
          )}
        </div>
      </div>
    </Link>
  );
}