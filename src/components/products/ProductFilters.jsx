'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/search/SearchBar';

export default function ProductFilters({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  // Fetchear marcas únicas al montar
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products?limit=1000`
        );
        const { products } = await res.json();
        const uniqueBrands = [...new Set(
          products.map(p => p.brand).filter(Boolean)
        )].sort();
        setBrands(uniqueBrands);
      } catch { }
    };
    fetchBrands();
  }, []);

  // Cerrar sugerencias al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda predictiva con debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, search: value });

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/search?q=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (product) => {
    setShowSuggestions(false);
    router.push(`/products/${product._id}`);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', brand: '', minPrice: '', maxPrice: '' });
    setSuggestions([]);
    setShowSuggestions(false);
    router.push('/products');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">
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
        <h2 className="font-bold text-gray-900 mb-5">Filtros</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[1000px] md:max-h-none' : 'max-h-0 md:max-h-none'} md:block`}
      >
        <div className="p-5 space-y-5">

          {/* Búsqueda predictiva */}
          <div className="relative" ref={suggestionsRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <SearchBar
              placeholder="Nombre, marca, modelo..."
              onSearch={() => { }} // el propio SearchBar navega al producto al seleccionar
              className="[&_form]:rounded-lg [&_form]:border-gray-200 [&_form]:hover:border-gray-400"
            />

            {/* Dropdown de sugerencias */}
            {showSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {loadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Buscando...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Sin resultados</div>
                ) : (
                  suggestions.map(product => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleSelectSuggestion(product)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                    >
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={36}
                          height={36}
                          className="rounded-md object-cover shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.brand} · ${Number(product.price).toLocaleString('es-AR')}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Categoría */}
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

          {/* Marca como select */}
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

          {/* Precio */}
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
        </div>
      </form>
    </div>
  );
}