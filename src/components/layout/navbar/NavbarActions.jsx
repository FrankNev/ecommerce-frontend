'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Shield, ClipboardList } from 'lucide-react';
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

export default function NavbarActions({ user, cartCount, onLogout }) {
  return (
    <div className="hidden md:flex items-center gap-1 shrink-0">

      <Button variant="ghost" size="icon" asChild className="relative mx-1">
        <Link href="/cart">
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <Badge className="absolute bg-red-500 -top-1 -right-1 px-1 min-w-[1rem] h-4 flex items-center justify-center text-[10px]">
              {cartCount}
            </Badge>
          )}
        </Link>
      </Button>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0 cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-black text-white font-semibold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || <User size={16} />}
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
              <Link href="/orders"><ClipboardList size={16} /> Mis órdenes</Link>
            </DropdownMenuItem>
            {user.role === 'admin' && (
              <DropdownMenuItem asChild className="cursor-pointer gap-2">
                <Link href="/admin"><Shield size={16} /> Panel admin</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 cursor-pointer gap-2 focus:text-red-700 focus:bg-red-50"
            >
              <LogOut size={16} /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="icon" asChild>
          <Link href="/login"><User size={22} /></Link>
        </Button>
      )}
    </div>
  );
}