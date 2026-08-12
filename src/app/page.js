import HomepageCarousel from '@/components/home/HomepageCarousel';
import BrandCard from '@/components/home/BrandCard';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';
import ProductCarousel from '@/components/products/ProductCarousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { getMostPurchased, getActivePromotionsWithProducts } from '@/lib/homeService';

export const metadata = {
  title: 'Inicio',
  description: 'Bienvenido a Mi Tienda, tu tienda online de electrónica',
};

const DEFAULT_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=80',
    title: 'Los últimos smartphones',
    subtitle: 'Encontrá el tuyo al mejor precio',
    cta: 'Ver productos',
    url: '/products?category=1',
    overlay: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1400&q=80',
    title: 'Smartwatches y wearables',
    subtitle: 'Tecnología en tu muñeca',
    cta: 'Explorar',
    url: '/products?category=4',
    overlay: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80',
    title: 'Audio de alta calidad',
    subtitle: 'Auriculares y parlantes premium',
    cta: 'Ver más',
    url: '/products?category=2',
    overlay: true,
  },
];

const BRANDS = [
  { name: 'Apple', logo: 'https://simpleicons.org/icons/apple.svg' },
  { name: 'Samsung', logo: 'https://simpleicons.org/icons/samsung.svg' },
  { name: 'Motorola', logo: 'https://simpleicons.org/icons/motorola.svg' },
  { name: 'Xiaomi', logo: 'https://simpleicons.org/icons/xiaomi.svg' },
  { name: 'JBL', logo: 'https://simpleicons.org/icons/jbl.svg' },
  { name: 'PlayStation', logo: 'https://simpleicons.org/icons/playstation.svg' },
  { name: 'XBOX', logo: 'https://www.svgrepo.com/show/473838/xbox.svg' },
  { name: 'Redragon', logo: 'https://simpleicons.org/icons/redragon.svg' },
];

export default async function HomePage() {
  const [mostPurchased, activePromos] = await Promise.all([
    getMostPurchased(),
    getActivePromotionsWithProducts()
  ]);

  const globalPromoSlides = activePromos
    .filter(p => p.type === 'GLOBAL' && p.image_url)
    .map(p => ({ image: p.image_url, title: p.name, subtitle: '¡Aprovechá esta oferta global!', cta: 'Ver tienda', url: '/products', overlay: true }));

  const specificPromoSlides = activePromos
    .filter(p => p.type === 'SPECIFIC' && p.image_url)
    .map(p => ({ image: p.image_url, title: p.name, subtitle: 'Descuentos en productos seleccionados', cta: 'Ver oferta', url: `/promotions/${p.id}`, overlay: true }));

  const finalSlides = [...globalPromoSlides, ...specificPromoSlides, ...DEFAULT_SLIDES];

  const unifiedPromoProductsMap = new Map();

  const globalPromos = activePromos.filter(p => p.type === 'GLOBAL');
  const specificPromos = activePromos.filter(p => p.type === 'SPECIFIC');

  // Función auxiliar para inyectar productos al mapa sin duplicados
  const addProducts = (promos) => {
    promos.forEach(promo => {
      if (promo.products && promo.products.length > 0) {
        promo.products.forEach(product => {
          if (!unifiedPromoProductsMap.has(product._id)) {
            unifiedPromoProductsMap.set(product._id, {
              ...product,
              badgeColor: promo.color
            });
          }
        });
      }
    });
  };

  addProducts(globalPromos);
  addProducts(specificPromos);

  const allPromoProducts = Array.from(unifiedPromoProductsMap.values());

  return (
    <div className="pb-8 space-y-8">

      {/* Carrusel hero */}
      <HomepageCarousel slides={finalSlides} />

      {/* Carruseles Dinámicos de Promociones */}
      {allPromoProducts.length > 0 && (
        <div className="pb-8">
          <div className="max-w-8xl mx-auto p-4 lg:mx-8 lg:px-8 lg:rounded-md" style={{
            background: `linear-gradient(to right, rgba(16, 24, 40, 0.5), transparent)`
          }}>
            <ProductCarousel title="Ofertas Destacadas" products={allPromoProducts} />
          </div>
        </div>

      )}

      {/* Marcas */}
      <section className="max-w-8xl mx-auto lg:mx-8 px-4 pb-8 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorá por marca</h2>
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="ml-0 pb-2">
            {BRANDS.map(brand => (
              <CarouselItem key={brand.name} className="px-3 basis-auto min-w-fit">
                <BrandCard brand={brand} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Productos más comprados */}
      <div className="max-w-8xl mx-auto lg:mx-8 pb-8 px-4 lg:px-8">
        <ProductCarousel title="Productos más comprados" products={mostPurchased} />
      </div>

      {/* Features */}
      <div className="bg-gray-900 py-8">
        <FeaturesSection />
      </div>

      {/* FAQ */}
      <div>
        <FAQSection />
      </div>

    </div>
  );
}