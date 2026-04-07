'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, Search, Shield, ClipboardList, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';
import { ecommerceAPI } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [expandSearchDesktop, setExpandSearchDesktop] = useState(false);
  const [expandSearchMobile, setExpandSearchMobile] = useState(false);
  const { user, logout } = useAuthStore();
  const count = useCartStore(state => state.getCount());
  const router = useRouter();
  const searchInputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await ecommerceAPI.get('/api/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    if (mounted) fetchCategories();
  }, [mounted]);

  useEffect(() => {
    if ((expandSearchDesktop || expandSearchMobile) && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [expandSearchDesktop, expandSearchMobile]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setExpandSearchDesktop(false);
      setExpandSearchMobile(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">

      {/* ── NIVEL 1: Logo + Búsqueda + Acciones ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 shrink-0">
            Mi Tienda
          </Link>

          {/* Barra de búsqueda — solo desktop */}
          {expandSearchDesktop ? (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl items-center border border-gray-300 rounded-full px-4 py-2 gap-2 hover:border-gray-500 transition-colors"
            >
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos"
                className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
              />
              <button type="submit" className="text-gray-500 hover:text-black transition-colors">
                <Search size={18} />
              </button>
            </form>
          ) : (
            <div className="hidden md:flex flex-1" />
          )}

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-1">

            {/* Botón búsqueda */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpandSearchDesktop(!expandSearchDesktop)}
              className="mx-1"
            >
              <Search size={22} />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Carrito */}
            <Button variant="ghost" size="icon" asChild className="relative mx-1">
              <Link href="/cart">
                <ShoppingCart size={22} />
                {mounted && count > 0 && (
                  <Badge className="absolute bg-red-500 -top-1 -right-1 px-1 min-w-[1rem] h-4 flex items-center justify-center text-[10px]">
                    {count}
                  </Badge>
                )}
                <span className="sr-only">Carrito</span>
              </Link>
            </Button>

            {/* Usuario */}
            {mounted && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-black text-white font-semibold text-sm">
                          {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer gap-2">
                      <Link href="/orders">
                        <ClipboardList size={16} /> Mis órdenes
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild className="cursor-pointer gap-2">
                        <Link href="/admin">
                          <Shield size={16} /> Panel admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 cursor-pointer gap-2 focus:text-red-700 focus:bg-red-50"
                    >
                      <LogOut size={16} /> Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/login">
                    <User size={22} />
                    <span className="sr-only">Ingresar</span>
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* Acciones mobile */}
          <div className="flex md:hidden items-center gap-1">
            {/* Botón búsqueda mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpandSearchMobile(!expandSearchMobile)}
            >
              <Search size={22} />
              <span className="sr-only">Buscar</span>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart size={22} />
                {mounted && count > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-[10px]">
                    {count}
                  </Badge>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                  <Link href="/products">Todos los productos</Link>
                </DropdownMenuItem>

                {/* Desplegable de categorías mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="p-3 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 rounded">
                      Categorías
                      <ChevronDown size={16} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {categories.map((cat) => (
                      <DropdownMenuItem asChild key={cat.id} className="cursor-pointer">
                        <Link href={`/products?category=${cat.id}`}>{cat.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                  <Link href="/contact">Contacto</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {mounted && (
                  user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                        <Link href="/orders">Mis órdenes</Link>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                          <Link href="/admin">Panel admin</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="p-3 text-sm text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50"
                      >
                        Cerrar sesión
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                      <Link href="/login">Ingresar</Link>
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── NIVEL 2: Categorías + Links secundarios — solo desktop ── */}
      <div className="hidden md:block border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-11">

            {/* Links principales izquierda */}
            <div className="flex items-center gap-6">
              <Link href="/products" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
                Todos los productos
              </Link>

              {/* Desplegable de categorías */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors font-medium flex items-center gap-2">
                    Categorías
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {categories.map((cat) => (
                    <DropdownMenuItem asChild key={cat.id} className="cursor-pointer">
                      <Link href={`/products?category=${cat.id}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Links secundarios derecha */}
            <div className="flex items-center gap-6">
              {mounted && (
                user?.role === 'admin' ? (
                  <Link href="/admin" className="text-sm text-gray-600 hover:text-black transition-colors font-medium flex items-center gap-1">
                    <Shield size={14} /> Panel Admin
                  </Link>
                ) : (
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors font-medium flex items-center gap-1">
                    Contacto
                  </Link>
                )
              )}
            </div>

          </nav>
        </div>
      </div>

      {/* ── BÚSQUEDA EXPANDIDA MOBILE ── */}
      {expandSearchMobile && (
        <div className="md:hidden border-t bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos"
              className="flex-1 text-sm outline-none bg-transparent"
              autoFocus
            />
            <button type="submit">
              <Search size={18} className="text-gray-400" />
            </button>
          </form>
        </div>
      )}

    </header>
  );
}