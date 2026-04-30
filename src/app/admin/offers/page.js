'use client';

import AdminPromotions from '@/components/admin/promotions/AdminPromotions';

export default function OfertasPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Ofertas</h1>
      <p className="text-gray-400 text-sm mb-6">
        Creá y gestioná promociones con reglas de precios por prioridad.
      </p>
      <AdminPromotions />
    </div>
  );
}