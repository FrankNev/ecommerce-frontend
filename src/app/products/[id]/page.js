import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';

export async function generateMetadata({ params }) {
    const { id } = await params;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/${id}`,
            { cache: 'no-store' }
        );
        const data = await res.json();
        return {
            title: data.name,
            description: data.description,
        };
    } catch {
        return { title: 'Producto' };
    }
}

async function getProduct(id) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/${id}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
                Producto no encontrado
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Imágenes */}
                <div className="space-y-4">
                    <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden">
                        {product.images?.[0]?.url ? (
                            <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                📦
                            </div>
                        )}
                    </div>

                    {/* Miniaturas */}
                    {product.images?.length > 1 && (
                        <div className="flex gap-3">
                            {product.images.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-gray-500 mt-3">{product.description}</p>
                    </div>

                    <p className="text-4xl font-bold text-gray-900">
                        ${product.price.toLocaleString('es-AR')}
                    </p>

                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                        </span>
                    </div>

                    {/* Atributos */}
                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                            <h3 className="font-semibold text-gray-900">Especificaciones</h3>
                            {Object.entries(product.attributes).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-500 capitalize">{key}</span>
                                    <span className="font-medium text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    );
}