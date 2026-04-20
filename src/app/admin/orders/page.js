'use client';

import AdminOrders from '@/components/admin/AdminOrders';

export default function OrdenesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Órdenes</h1>
      <AdminOrders />
    </div>
  );
}