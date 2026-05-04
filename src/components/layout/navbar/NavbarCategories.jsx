'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NavbarCategories({ categories, user }) {
  const router = useRouter();

  return (
    <div className="hidden md:block border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-11">

          <div className="flex items-center gap-6">
            <Link
              href="/products"
              prefetch={false}
              className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
            >
              Todos los productos
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm text-gray-600 hover:text-black transition-colors font-medium flex items-center gap-2 cursor-pointer">
                  Categorías <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map(cat => (
                  <DropdownMenuItem 
                    key={cat.id} 
                    className="cursor-pointer"
                    onClick={() => router.push(`/products?category=${cat.id}`)}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-6">
            {user?.role === 'admin' ? (
              <button
                onClick={() => router.push('/admin')}
                className="text-sm text-gray-600 hover:text-black transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <Shield size={14} /> Panel Admin
              </button>
            ) : (
              <Link
                href="/contact"
                prefetch={false}
                className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
              >
                Contacto
              </Link>
            )}
          </div>

        </nav>
      </div>
    </div>
  );
}