import HomepageCarousel from '@/components/home/HomepageCarousel';
import BrandCard from '@/components/home/BrandCard';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

export const metadata = {
  title: 'Inicio',
  description: 'Bienvenido a Mi Tienda, tu tienda online de electrónica',
};

const BRANDS = [
  { name: 'Apple', logo: 'https://simpleicons.org/icons/apple.svg' },
  { name: 'Samsung', logo: 'https://simpleicons.org/icons/samsung.svg' },
  { name: 'Motorola', logo: 'https://simpleicons.org/icons/motorola.svg' },
  { name: 'Xiaomi', logo: 'https://simpleicons.org/icons/xiaomi.svg' },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">

      {/* Carrusel hero */}
      <HomepageCarousel />

      {/* Marcas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorá por marca</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="ml-0">
            {BRANDS.map(brand => (
              <CarouselItem key={brand.name} className="px-3 py-2 basis-auto min-w-fit">
                <BrandCard brand={brand} />
              </CarouselItem>
            ))}
          </CarouselContent>

        </Carousel>
      </section>

      {/* Features */}
      <div className="bg-gray-900 py-8">
        <FeaturesSection />
      </div>

      {/* FAQ */}
      <FAQSection />

    </div>
  );
}