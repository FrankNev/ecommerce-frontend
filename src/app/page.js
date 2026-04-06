import HomepageCarousel from '@/components/home/HomepageCarousel';
import BrandCard from '@/components/home/BrandCard';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';

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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '1rem',
          }}
        >
          {BRANDS.map(brand => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* FAQ */}
      <FAQSection />

    </div>
  );
}