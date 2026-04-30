'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Eye, Power, Pencil, Trash2 } from 'lucide-react';
import { TYPE_LABELS, getStatusBadge, formatDate } from './constants';

export default function PromotionCard({
  promo,
  isExpanded,
  categories,
  onToggleExpand,
  onPreview,
  onToggleActive,
  onEdit,
  onDelete,
}) {
  const status = getStatusBadge(promo);
  const TypeIcon = TYPE_LABELS[promo.type]?.icon;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">

      {/* Fila de resumen */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggleExpand}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_LABELS[promo.type]?.color}`}>
          <TypeIcon size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{promo.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{TYPE_LABELS[promo.type]?.label}</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs font-semibold text-gray-700">
              {promo.discount_type === 'PERCENTAGE'
                ? `-${promo.value}%`
                : `-$${Number(promo.value).toLocaleString('es-AR')}`
              }
            </span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">Prioridad {promo.priority}</span>
          </div>
        </div>

        <Badge variant={status.variant} className="shrink-0 text-xs">
          {status.label}
        </Badge>

        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <Button size="icon-sm" variant="ghost" title="Previsualizar precio" onClick={onPreview}>
            <Eye size={14} />
          </Button>
          <Button
            size="icon-sm" variant="ghost"
            title={promo.is_active ? 'Desactivar' : 'Activar'}
            onClick={onToggleActive}
            className={promo.is_active ? 'text-green-600' : 'text-gray-400'}
          >
            <Power size={14} />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onEdit}>
            <Pencil size={14} />
          </Button>
          <Button size="icon-sm" variant="ghost" className="text-red-400 hover:text-red-600" onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        </div>

        {isExpanded
          ? <ChevronUp size={14} className="text-gray-400 shrink-0" />
          : <ChevronDown size={14} className="text-gray-400 shrink-0" />
        }
      </div>

      {/* Detalles expandidos */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-3 text-sm">
          {promo.description && (
            <p className="text-gray-500 italic">{promo.description}</p>
          )}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {promo.start_date && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Inicio</span>
                <p className="font-medium text-gray-700">{formatDate(promo.start_date)}</p>
              </div>
            )}
            {promo.end_date && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Fin</span>
                <p className="font-medium text-gray-700">{formatDate(promo.end_date)}</p>
              </div>
            )}
            {promo.conditions?.min_purchase && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Mínimo de compra</span>
                <p className="font-medium text-gray-700">
                  ${Number(promo.conditions.min_purchase).toLocaleString('es-AR')}
                </p>
              </div>
            )}
            {promo.conditions?.excluded_brands?.length > 0 && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Marcas excluidas</span>
                <p className="font-medium text-gray-700">
                  {promo.conditions.excluded_brands.join(', ')}
                </p>
              </div>
            )}
            {promo.conditions?.excluded_categories?.length > 0 && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Categorías excluidas</span>
                <p className="font-medium text-gray-700">
                  {promo.conditions.excluded_categories
                    .map(id => categories.find(c => c.id === id)?.name ?? `ID ${id}`)
                    .join(', ')}
                </p>
              </div>
            )}
            {promo.product_ids?.length > 0 && (
              <div className="col-span-2">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Productos incluidos ({promo.product_ids.length})
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}