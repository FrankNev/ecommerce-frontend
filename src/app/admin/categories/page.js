'use client';

import AdminCategories from '@/components/admin/AdminCategories';

export default function OrdenesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Órdenes</h1>
      <AdminCategories />
    </div>
  );
}