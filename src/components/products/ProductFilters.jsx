'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ProductFilters({ categories, brands }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({ category: '', brand: '', minPrice: '', maxPrice: '' });
    router.push('/products');
  };

  return (
    <div className="bg-white rounded-md shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden flex items-center justify-between p-5 font-semibold text-gray-900 border-b border-gray-200"
      >
        <span>Filtros</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      <div className="hidden md:block p-5 pb-0">
        <h2 className="font-bold text-gray-900">Filtros</h2>
      </div>

      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[1000px] md:max-h-none' : 'max-h-0 md:max-h-none'} md:block`}>
        <div className="p-5 space-y-5">

          {/* Filtros */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Todas</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Todas</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="$ 0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="$ 999999"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
            >
              Aplicar filtros
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
            >
              Limpiar filtros
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}