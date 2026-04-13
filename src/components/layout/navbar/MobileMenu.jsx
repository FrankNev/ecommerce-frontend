'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchBar from '@/components/search/SearchBar';

export default function MobileMenu({
    user,
    cartCount,
    categories,
    onLogout,
    searchExpanded,
    onToggleSearch,
    searchInputRef,
}) {
    return (
        <>
            {/* Botones mobile */}
            <div className="flex md:hidden items-center gap-1">
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu size={24} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                            <Link href="/products">Todos los productos</Link>
                        </DropdownMenuItem>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="p-3 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 rounded">
                                    Categorías <ChevronDown size={16} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {categories.map(cat => (
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

                        {user ? (
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
                                    onClick={onLogout}
                                    className="p-3 text-sm text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50"
                                >
                                    Cerrar sesión
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <DropdownMenuItem asChild className="p-3 text-sm cursor-pointer">
                                <Link href="/login">Ingresar</Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Búsqueda expandida mobile */}
            {searchExpanded && (
                <div className="md:hidden border-t bg-white px-4 py-3">
                    <SearchBar
                        inputRef={searchInputRef}
                        onSearch={onToggleSearch}
                        placeholder="Buscar productos"
                    />
                </div>
            )}
        </>
    );
}