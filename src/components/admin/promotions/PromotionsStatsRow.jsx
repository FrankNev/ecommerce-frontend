import { Zap, Power, Globe } from 'lucide-react';

export default function PromotionStatsRow({ promotions }) {
  const now = new Date();
  const activeCount = promotions.filter(p =>
    p.is_active
    && (!p.start_date || new Date(p.start_date) <= now)
    && (!p.end_date   || new Date(p.end_date)   >= now)
  ).length;

  const stats = [
    { label: 'Total de ofertas', value: promotions.length,                               icon: Zap },
    { label: 'Activas ahora',    value: activeCount,                                      icon: Power },
    { label: 'Globales',         value: promotions.filter(p => p.type === 'GLOBAL').length, icon: Globe },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
            <Icon size={16} className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}