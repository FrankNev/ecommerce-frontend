'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Menu,
  Search,
  Shield,
  ClipboardList,
  LogOut,
  Tag,
  LayoutDashboard,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppSidebar from '@/components/layout/AppSidebar';

export default function MobileMenu({
  user,
  cartCount,
  categories,
  onLogout,
  searchExpanded,
  onToggleSearch,
  searchInputRef,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const sections = [];

  // 1. Todos los productos (siempre visible)
  sections.push({
    id: 'all-products',
    label: 'Todos los productos',
    href: '/products',
  });

  // 2. Categorías
  if (isAdmin) {
    sections.push({
      id: 'categories',
      label: 'Categorías',
      icon: <Tag size={16} />,
      collapsible: true,
      defaultOpen: false,
      children: categories.map((cat) => ({
        id: `cat-${cat.id}`,
        label: cat.name,
        href: `/products?category=${cat.id}`,
      })),
    });
  } else {
    sections.push(
      ...categories.map((cat) => ({
        id: `cat-${cat.id}`,
        label: cat.name,
        href: `/products?category=${cat.id}`,
      }))
    );
  }

  // 3. Contacto (solo usuarios no-admin)
  if (!isAdmin) {
    sections.push({
      id: 'contact',
      label: 'Contacto',
      href: '/contact',
      icon: <Phone size={16} />,
      dividerBefore: true,
    });
  }

  // 4. Sección de usuario autenticado
  if (user) {
    if (isAdmin) {
      sections.push({
        id: 'admin',
        label: 'Panel de administración',
        href: '/admin',
        icon: <Shield size={16} />,
        dividerBefore: true,
      });
    }

    sections.push({
      id: 'orders',
      label: 'Mis órdenes',
      href: '/orders',
      icon: <ClipboardList size={16} />,
      dividerBefore: !isAdmin,
    });

    sections.push({
      id: 'logout',
      label: 'Cerrar sesión',
      icon: <LogOut size={16} />,
      onClick: onLogout,
      variant: 'danger',
      dividerBefore: true,
    });
  } else {
    // No autenticado
    sections.push({
      id: 'login',
      label: 'Iniciar sesión',
      href: '/login',
      dividerBefore: true,
    });
  }

  // ── Header del sidebar ─────────────────────────────────────────────────────

  const sidebarHeader = user ? (
    <div className="flex flex-col min-w-0">
      <span className="font-semibold text-sm text-gray-900 truncate">{user.name}</span>
      <span className="text-xs text-gray-400 truncate">{user.email}</span>
    </div>
  ) : (
    <span className="font-semibold text-gray-900 text-sm">Menú</span>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Botones visibles en mobile */}
      <div className="flex md:hidden items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" onClick={onToggleSearch}>
          <Search size={22} />
        </Button>

        <Button variant="ghost" size="icon" asChild className="relative">
          <Link href="/cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Sidebar */}
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        header={sidebarHeader}
        sections={sections}
      />
    </>
  );
}