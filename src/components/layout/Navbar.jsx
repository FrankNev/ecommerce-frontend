'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';

// Importamos los componentes de shadcn/ui que ya tienes en tu proyecto
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const count = useCartStore(state => state.getCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función auxiliar para obtener la inicial del usuario para el Avatar
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    return <User size={18} />;
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LADO IZQUIERDO: Logo y Links (Solo Desktop) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              Mi Tienda
            </Link>

            {/* Links de navegación - Ocultos en móvil */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Productos
              </Link>
              {mounted && user?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* LADO DERECHO: Acciones Desktop (Carrito y Usuario) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Ícono de Carrito usando Button ghost de shadcn y Badge */}
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

            {mounted && (
              user ? (
                <div className="flex items-center gap-3 ml-2 pl-4 border-l">
                  {/* Link a órdenes con diseño de Avatar */}
                  <Link href="/orders" className="flex items-center gap-2 group cursor-pointer">
                    <div className="h-9 w-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                      {getUserInitial()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                      {user.name || user.firstName || 'Perfil'}
                    </span>
                  </Link>
                  
                  <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut size={18} />
                    <span className="sr-only">Cerrar sesión</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2 pl-4 border-l">
                  <Button variant="ghost" asChild className="gap-2">
                    <Link href="/login">
                      <User size={20} />
                      Ingresar
                    </Link>
                  </Button>
                </div>
              )
            )}
          </div>

          {/* BOTÓN MENÚ MÓVIL (Solo visible en pantallas pequeñas) */}
          <div className="flex md:hidden items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* DESPLEGABLE MENÚ MÓVIL */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-2 bg-white animate-in slide-in-from-top-2">
            
            <Link href="/products" className="px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-md" onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
            
            {mounted && user?.role === 'admin' && (
              <Link href="/admin" className="px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-md" onClick={() => setMenuOpen(false)}>
                Panel de Administración
              </Link>
            )}

            <Link href="/cart" className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-md" onClick={() => setMenuOpen(false)}>
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <span>Carrito</span>
              </div>
              {mounted && count > 0 && (
                <Badge variant="secondary">{count}</Badge>
              )}
            </Link>
            
            <div className="h-px bg-gray-100 my-2 mx-4"></div>
            
            {mounted && (
              user ? (
                <>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-md" onClick={() => setMenuOpen(false)}>
                    <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {getUserInitial()}
                    </div>
                    Mis Órdenes
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md text-left w-full">
                    <LogOut size={20} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-md" onClick={() => setMenuOpen(false)}>
                  <User size={20} />
                  Ingresar a mi cuenta
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}