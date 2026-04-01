'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProductFilters({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
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
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '' });
    router.push('/products');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
      <h2 className="font-bold text-gray-900">Filtros</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Nombre del producto..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

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
  );
}