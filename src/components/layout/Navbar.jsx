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

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            Mi Tienda
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition">
              Productos
            </Link>
            {mounted && user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition">
                Admin
              </Link>
            )}
          </div>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 transition">
              <ShoppingCart size={22} />
              {mounted && count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {mounted && (
              user ? (
                <div className="flex items-center gap-3">
                  <Link href="/orders" className="text-gray-600 hover:text-gray-900 transition">
                    <User size={22} />
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-gray-900 transition">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                  Ingresar
                </Link>
              )
            )}
          </div>

          {/* Botón menú mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú mobile */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-4">
            <Link href="/products" className="text-gray-600" onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
            <Link href="/cart" className="text-gray-600" onClick={() => setMenuOpen(false)}>
              Carrito {mounted && count > 0 && `(${count})`}
            </Link>
            {mounted && (
              user ? (
                <>
                  <Link href="/orders" className="text-gray-600" onClick={() => setMenuOpen(false)}>
                    Mis órdenes
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-gray-600">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-600" onClick={() => setMenuOpen(false)}>
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