'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ecommerceAPI } from '@/lib/axios';

export default function ProductSearchMultiselect({ selectedIds, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIds.length === 0) { setSelectedProducts([]); return; }
    const fetchSelected = async () => {
      const details = await Promise.all(
        selectedIds.map(id =>
          ecommerceAPI.get(`/api/products/${id}`).then(r => r.data).catch(() => null)
        )
      );
      setSelectedProducts(
        details.filter(Boolean).map(p => ({ _id: p._id, name: p.name, brand: p.brand }))
      );
    };
    fetchSelected();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await ecommerceAPI.get(`/api/products/search?q=${encodeURIComponent(query)}`);
        setResults(data.filter(p => !selectedIds.includes(p._id)));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const addProduct = (product) => {
    onChange([...selectedIds, product._id]);
    setSelectedProducts(prev => [...prev, { _id: product._id, name: product.name, brand: product.brand }]);
    setQuery('');
    setResults([]);
  };

  const removeProduct = (id) => {
    onChange(selectedIds.filter(i => i !== id));
    setSelectedProducts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="pl-8"
        />
        {results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {loading
              ? <p className="p-3 text-sm text-gray-400">Buscando...</p>
              : results.map(p => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => addProduct(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition text-sm"
                >
                  <span className="font-medium">{p.name}</span>
                  {p.brand && <span className="text-gray-400 ml-2">{p.brand}</span>}
                </button>
              ))
            }
          </div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map(p => (
            <span
              key={p._id}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium"
            >
              {p.name}
              <button
                type="button"
                onClick={() => removeProduct(p._id)}
                className="text-gray-400 hover:text-red-500 transition ml-1"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}