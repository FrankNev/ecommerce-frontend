import VariantSelector from '@/components/products/VariantSelector';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/${id}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return { title: data.name, description: data.description };
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

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
          {product.images?.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="bg-gray-50 rounded-2xl overflow-hidden border flex items-center justify-center"
                      style={{ height: '420px' }}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} - Imagen ${index + 1}`}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious style={{ left: '0px' }} />
                  <CarouselNext style={{ right: '0px' }} />
                </>
              )}
            </Carousel>
          ) : (
            <div
              className="bg-gray-100 rounded-2xl flex items-center justify-center text-6xl"
              style={{ height: '420px' }}
            >
              📦
            </div>
          )}
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

      {/* SECCIÓN INFERIOR: Descripción + Especificaciones */}
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
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Especificaciones técnicas</h2>
            <Separator />
            <div className="space-y-3">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 capitalize font-medium">{key}</span>
                  <span className="font-semibold text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}