import AddToCartButton from '@/components/products/AddToCartButton';
import { Badge } from '@/components/ui/badge';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* ── SECCIÓN PRINCIPAL: Imagen + Info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">

        {/* Carrusel de imágenes */}
        <div className="w-full">
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
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
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

        {/* Info del producto */}
        <div className="space-y-6">

          {/* Nombre y stock */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </Badge>
          </div>

          <Separator />

          {/* Precio */}
          <p className="text-4xl font-bold text-gray-900">
            ${product.price.toLocaleString('es-AR')}
          </p>

          <Separator />

          {/* Selector cantidad + botones */}
          <AddToCartButton product={product} />

        </div>
      </div>

      {/* ── SECCIÓN INFERIOR: Descripción + Especificaciones ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Descripción */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Descripción</h2>
          <Separator />
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Especificaciones técnicas */}
        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Especificaciones técnicas</h2>
            <Separator />
            <div className="space-y-3">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 capitalize font-medium">{key}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}