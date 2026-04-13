'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';
import { ecommerceAPI } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/search/SearchBar';
import NavbarActions from '@/components/layout/navbar/NavbarActions';
import NavbarCategories from '@/components/layout/navbar/NavbarCategories';
import MobileMenu from '@/components/layout/navbar/MobileMenu';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandSearchDesktop, setExpandSearchDesktop] = useState(false);
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
      } catch {}
    };
    if (mounted) fetchCategories();
  }, [mounted]);

  useEffect(() => {
    if ((expandSearchDesktop || expandSearchMobile) && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [expandSearchDesktop, expandSearchMobile]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">

      {/* Nivel 1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 shrink-0">
            Mi Tienda
          </Link>

          {/* Búsqueda desktop */}
          {expandSearchDesktop ? (
            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBar
                inputRef={searchInputRef}
                onSearch={() => setExpandSearchDesktop(false)}
              />
            </div>
          ) : (
            <div className="hidden md:flex flex-1" />
          )}

          {/* Botón búsqueda desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex mx-1"
            onClick={() => setExpandSearchDesktop(!expandSearchDesktop)}
          >
            <Search size={22} />
          </Button>

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
      </div>

      {/* Nivel 2 */}
      {mounted && (
        <NavbarCategories categories={categories} user={user} />
      )}

    </header>
  );
}