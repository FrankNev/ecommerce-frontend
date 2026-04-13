'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { ecommerceAPI } from '@/lib/axios';

export default function SearchBar({
    inputRef,
    onSearch,
    placeholder = 'Buscar productos',
    className = '',
}) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await ecommerceAPI.get(
                    `/api/products/search?q=${encodeURIComponent(value)}`
                );
                setSuggestions(data);
                setShowSuggestions(true);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        setShowSuggestions(false);
        setSearch('');
        onSearch?.();
        router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    };

    const handleSelectSuggestion = (product) => {
        setShowSuggestions(false);
        setSearch('');
        onSearch?.();
        router.push(`/products/${product._id}`);
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <form
                onSubmit={handleSubmit}
                className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-2 hover:border-gray-500 transition-colors"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                />
                <button type="submit" className="text-gray-500 hover:text-black transition-colors">
                    <Search size={18} />
                </button>
            </form>

            {showSuggestions && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {loading ? (
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
                                    <p className="text-xs text-gray-400">
                                        {product.brand} · ${Number(product.price).toLocaleString('es-AR')}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}