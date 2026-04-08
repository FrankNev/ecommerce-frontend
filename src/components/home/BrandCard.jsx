import Link from 'next/link';

export default function BrandCard({ brand }) {
  return (
    <Link
      href={`/products?brand=${encodeURIComponent(brand.name)}`}
      className="group bg-white rounded-full border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-3"
      style={{ width: '140px', height: '140px' }}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        style={{ height: '40px', objectFit: 'contain', filter: 'grayscale(100%)', transition: 'filter 0.3s' }}
        className="group-hover:grayscale-0"
      />
      <p className="text-sm font-semibold text-gray-600 group-hover:text-black transition">
        {brand.name}
      </p>
    </Link>
  );
}