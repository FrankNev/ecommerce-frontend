import ProductJsonLd from '@/components/products/ProductJsonLd';
import VariantSelector from '@/components/products/VariantSelector';
import ProductCarousel from '@/components/products/ProductCarousel';
import ProductImageCarousel from '@/components/products/ProductImageCarousel';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/${id}`,
      { next: { revalidate: 3600 } }
    );
    const product = await res.json();

    const title = product.name;
    const description = product.description
      ? product.description.slice(0, 160)
      : `Comprá ${product.name} al mejor precio.`;
    const image = product.images?.[0]?.url || '/og-image.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://ecommerce-frontend-nine-ebon.vercel.app/products/${id}`,
        images: [{ url: image, width: 800, height: 800, alt: title }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      other: {
        'product:price:amount': product.price,
        'product:price:currency': 'ARS',
      },
    };
  } catch {
    return {
      title: 'Producto no encontrado',
      description: 'Este producto no está disponible.',
    };
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

async function getRelatedProducts(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/${id}/related?limit=6`,
      { next: { revalidate: 3600 } }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const [product, relatedProducts] = await Promise.all([
    getProduct(id),
    getRelatedProducts(id),
  ]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Producto no encontrado
      </div>
    );
  }

  return (
    <div className="max-w-7xl rounded-md mt-4 mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-white">
      <ProductJsonLd product={product} />

      {/* SECCIÓN PRINCIPAL: Imagen + Info */}
      <div
        className="gap-10 items-start"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
        }}
      >
        {/* Carrusel */}
        <div style={{ position: 'relative', width: '100%' }}>
          < ProductImageCarousel images={product.images} productName={product.name} />
        </div>

        {/* Info + Variantes + Carrito */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          <Separator />
          <VariantSelector product={product} />
        </div>
      </div>

      {/* SECCIÓN INTERMEDIA: Descripción + Especificaciones */}
      <div
        className="gap-10"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        }}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Descripción</h2>
          <Separator />
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Especificaciones técnicas</h2>
            <Separator />
            <div className="space-y-3">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-2 border-b border-gray-300 last:border-0">
                  <span className="text-gray-500 capitalize font-medium">{key}</span>
                  <span className="font-semibold text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN INFERIOR: Carrusel de productos relacionados */}
      <ProductCarousel title="Productos relacionados" products={relatedProducts} />
    </div>
  );
}