'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, Search, Shield, ClipboardList } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';
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
  const { user, logout } = useAuthStore();
  const count = useCartStore(state => state.getCount());
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return <User size={16} />;
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
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center border border-gray-300 rounded-full px-4 py-2 gap-2 hover:border-gray-500 transition-colors"
          >
            <input
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

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-1">

            {/* Carrito */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart size={22} />
                {mounted && count > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-[10px]">
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
                          {getUserInitial()}
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
                {/* Búsqueda mobile */}
                <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar productos"
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                  <button type="submit"><Search size={16} className="text-gray-400" /></button>
                </form>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                  <Link href="/products">Productos</Link>
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
              <Link href="/products?category=1" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
                Electrónica
              </Link>
            </div>

            {/* Links secundarios derecha */}
            <div className="flex items-center gap-6">
              {mounted && user?.role === 'admin' && (
                <Link href="/admin" className="text-sm text-gray-600 hover:text-black transition-colors font-medium flex items-center gap-1">
                  <Shield size={14} /> Panel Admin
                </Link>
              )}
            </div>

          </nav>
        </div>
      </div>

    </header>
  );
}