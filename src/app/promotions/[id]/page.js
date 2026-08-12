import ProductCard from '@/components/products/ProductCard';
import { getPromotionWithProductsById } from '@/lib/homeService';
import Breadcrumb from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';


export async function generateMetadata({ params }) {
  const { id } = await params;
  const promo = await getPromotionWithProductsById(id);
  if (!promo) return { title: 'Promoción no encontrada' };
  return { title: `Oferta: ${promo.name} | Mi Tienda`, description: promo.description };
}

export default async function PromotionPage({ params }) {
  const { id } = await params;
  const promo = await getPromotionWithProductsById(id);

  if (!promo || !promo.is_active) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Ofertas', href: '#' },
          { label: promo.name, href: `/promotions/${promo.id}` }
        ]}
      />

      <div className="mt-6">
        {/* Cabecera */}
        <div
          className="relative w-full rounded-md p-6 md:p-8 text-white shadow-sm overflow-hidden mb-8"
          style={{ backgroundColor: promo.color || '#111827' }}
        >
          {promo.image_url && (
            <img
              src={promo.image_url}
              alt={promo.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
          )}
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {promo.name}
            </h1>
            <p className="text-sm md:text-md max-w-2xl text-white/90 font-medium">
              {promo.description || 'Aprovechá nuestros productos seleccionados en oferta.'}
            </p>
          </div>
        </div>

        {/* Listado de Productos */}
        {promo.products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No se encontraron productos en esta promoción
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 lg:gap-4 gap-3">
            {promo.products.map(product => (
              <ProductCard key={product._id} product={product} totalHeight={200} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}