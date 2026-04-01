import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
        {/* Imagen */}
        <div style={{ position: 'relative', height: '160px', width: '125px', overflow: 'hidden' }} className="bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              className="group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
          </p>
          <h3 className="font-semibold text-gray-900 group-hover:text-black transition line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="text-lg font-bold text-gray-900 mt-3">
            ${product.price.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </Link>
  );
}