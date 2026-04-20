'use client';

import AdminProducts from '@/components/admin/AdminProducts';

export default function ProductosPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Productos</h1>
      <AdminProducts />
    </div>
  );
}