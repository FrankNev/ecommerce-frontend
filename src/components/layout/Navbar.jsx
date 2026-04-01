'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const count = useCartStore(state => state.getCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Lado Izquierdo: Logo y Links de navegación */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              Mi Tienda
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Productos
              </Link>
              {mounted && user?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Lado Derecho: Acciones desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 transition flex items-center gap-2">
              <ShoppingCart size={22} />
              {mounted && count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {mounted && (
              user ? (
                <div className="flex items-center gap-4">
                  <Link href="/orders" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                    <User size={22} />
                    <span className="text-sm font-medium">
                      {/* Ajusta "user.name" según cómo esté estructurado tu modelo User en la DB */}
                      {user.name || user.firstName || 'Mi Perfil'}
                    </span>
                  </Link>
                  <button onClick={logout} className="text-gray-400 hover:text-red-600 transition" title="Cerrar sesión">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group">
                  <User size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Ingresar</span>
                </Link>
              )
            )}
          </div>

          {/* Menú Mobile: Mantengo el carrito a la vista junto al botón de hamburguesa */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-600">
              <ShoppingCart size={22} />
              {mounted && count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú mobile desplegable */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-4 bg-white">
            <Link href="/products" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
            {mounted && user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            
            <div className="h-px bg-gray-100 my-2"></div>
            
            {mounted && (
              user ? (
                <>
                  <Link href="/orders" className="flex items-center gap-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                    <User size={20} />
                    {user.name || user.firstName || 'Mi Perfil'}
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 text-left text-gray-600 font-medium">
                    <LogOut size={20} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  <User size={20} />
                  Ingresar
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}