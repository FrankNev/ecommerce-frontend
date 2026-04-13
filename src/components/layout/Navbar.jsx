'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';
import { ecommerceAPI } from '@/lib/axios';
import SearchBar from '@/components/search/SearchBar';
import NavbarActions from '@/components/layout/navbar/NavbarActions';
import NavbarCategories from '@/components/layout/navbar/NavbarCategories';
import MobileMenu from '@/components/layout/navbar/MobileMenu';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandSearchMobile, setExpandSearchMobile] = useState(false);
  const { user, logout } = useAuthStore();
  const count = useCartStore(state => state.getCount());
  const searchInputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await ecommerceAPI.get('/api/categories');
        setCategories(data);
      } catch { }
    };
    if (mounted) fetchCategories();
  }, [mounted]);

  useEffect(() => {
    if (expandSearchMobile && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [expandSearchMobile]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">

      {/* Nivel 1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 shrink-0">
            Mi Tienda
          </Link>

          {/* SearchBar siempre visible en desktop, centrada */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="w-full max-w-xl">
              <SearchBar placeholder="Buscar productos..." />
            </div>
          </div>

          {/* Acciones desktop */}
          {mounted && (
            <NavbarActions
              user={user}
              cartCount={count}
              onLogout={logout}
            />
          )}

          {/* Menú mobile */}
          {mounted && (
            <MobileMenu
              user={user}
              cartCount={count}
              categories={categories}
              onLogout={logout}
              searchExpanded={expandSearchMobile}
              onToggleSearch={() => setExpandSearchMobile(prev => !prev)}
              searchInputRef={searchInputRef}
            />
          )}

        </div>
        {expandSearchMobile && (
          <div className="md:hidden border-t bg-white px-4 py-3">
            <SearchBar
              inputRef={searchInputRef}
              onSearch={() => setExpandSearchMobile(false)}
              placeholder="Buscar productos"
            />
          </div>
        )}
      </div>

      {/* Nivel 2 — categorías desktop */}
      {mounted && (
        <NavbarCategories categories={categories} user={user} />
      )}

    </header>
  );
}