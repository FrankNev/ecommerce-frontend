'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  ShoppingBag,
  ClipboardList,
  FileText,
  Users,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  LayoutList,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    id: 'metricas', label: 'Métricas', href: '/admin/metrics', icon: BarChart2,
  },
  {
    id: 'ordenes', label: 'Órdenes', href: '/admin/orders', icon: ClipboardList,
  },
  {
    id: 'productos', label: 'Productos', href: '/admin/products', icon: ShoppingBag,
  },
  {
    id: 'categorias', label: 'Categorías', href: '/admin/categories', icon: LayoutList,
  },
  {
    id: 'ofertas', label: 'Ofertas', href: '/admin/offers', icon: Zap,
  },
  {
    id: 'reportes', label: 'Reportes', href: '/admin/reports', icon: FileText,
  },
  {
    id: 'clientes', label: 'Clientes', href: '/admin/clients', icon: Users,
  },
];

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className="relative flex flex-col h-screen bg-white border-r border-gray-100 shrink-0 transition-all duration-300 ease-in-out"
      style={{ width: expanded ? '220px' : '60px' }}
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center h-16 border-b border-gray-100 overflow-hidden shrink-0"
        style={{ padding: expanded ? '0 1.25rem' : '0', justifyContent: expanded ? 'flex-start' : 'center' }}
      >
        {expanded ? (
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-900 hover:text-black transition"
          >
            <ChevronLeft />
            <Store size={20} className="shrink-0" />
            <span className="font-black tracking-tighter text-lg whitespace-nowrap">
              Mi Tienda
            </span>

          </Link>
        ) : (
          <Link href="/" aria-label="Ir al inicio">
            <Store size={20} className="text-gray-700 hover:text-black transition" />
          </Link>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-hidden">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  title={!expanded ? item.label : undefined}
                  className={`
                    relative flex items-center h-10 text-sm font-medium transition-colors group
                    ${expanded ? 'px-4 gap-3' : 'justify-center'}
                    ${isActive
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Indicador activo */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-gray-900 rounded-r-full" />
                  )}

                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-700'
                      }`}
                  />

                  {expanded && (
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  )}

                  {/* Tooltip cuando está contraído */}
                  {!expanded && (
                    <span className="
                      pointer-events-none absolute left-full ml-3 px-2 py-1
                      bg-gray-900 text-white text-xs rounded-md whitespace-nowrap
                      opacity-0 group-hover:opacity-100 transition-opacity z-50
                    ">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Botón colapsar */}
      <div className="shrink-0 border-t border-gray-100 py-3"
        style={{ padding: expanded ? '0.75rem 1rem' : '0.75rem 0', display: 'flex', justifyContent: expanded ? 'flex-end' : 'center' }}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
          aria-label={expanded ? 'Contraer menú' : 'Expandir menú'}
          title={expanded ? 'Contraer' : 'Expandir'}
        >
          {expanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>
    </aside>
  );
}