'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import ProductSearchMultiselect from './ProductSearchMultiselect';
import ExcludedBrandsInput from './ExcludedBrandsInput';
import {
  EMPTY_FORM, TYPE_LABELS, DISCOUNT_LABELS,
  toLocalDatetimeInput, localDatetimeInputToUTC,
} from './constants';

export default function PromotionFormDialog({ open, onClose, onSave, editingPromotion, categories }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [useSchedule, setUseSchedule] = useState(false);

  useEffect(() => {
    if (editingPromotion) {
      const conditions = editingPromotion.conditions || {};
      setForm({
        name:          editingPromotion.name || '',
        description:   editingPromotion.description || '',
        type:          editingPromotion.type || 'GLOBAL',
        discount_type: editingPromotion.discount_type || 'PERCENTAGE',
        value:         editingPromotion.value || '',
        start_date:    toLocalDatetimeInput(editingPromotion.start_date),
        end_date:      toLocalDatetimeInput(editingPromotion.end_date),
        priority:      editingPromotion.priority || 0,
        is_active:     editingPromotion.is_active !== false && editingPromotion.is_active !== 0,
        conditions: {
          min_purchase:        conditions.min_purchase || '',
          excluded_categories: conditions.excluded_categories || [],
          excluded_brands:     conditions.excluded_brands || [],
        },
        product_ids: editingPromotion.product_ids || [],
      });
      setUseSchedule(!!(editingPromotion.start_date || editingPromotion.end_date));
    } else {
      setForm(EMPTY_FORM);
      setUseSchedule(false);
    }
  }, [editingPromotion, open]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setCondition = (key, val) => setForm(f => ({ ...f, conditions: { ...f.conditions, [key]: val } }));

  const toggleExcludedCategory = (catId) => {
    const current = form.conditions.excluded_categories || [];
    setCondition('excluded_categories',
      current.includes(catId) ? current.filter(id => id !== catId) : [...current, catId]
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (!form.value && form.value !== 0) { toast.error('El valor del descuento es obligatorio'); return; }
    if (form.type === 'SPECIFIC' && form.product_ids.length === 0) {
      toast.error('Seleccioná al menos un producto'); return;
    }

    setLoading(true);
    try {
      const conditions = {};
      if (form.conditions.min_purchase)              conditions.min_purchase        = Number(form.conditions.min_purchase);
      if (form.conditions.excluded_categories?.length) conditions.excluded_categories = form.conditions.excluded_categories;
      if (form.conditions.excluded_brands?.length)   conditions.excluded_brands     = form.conditions.excluded_brands;

      await onSave({
        ...form,
        value:      Number(form.value),
        priority:   Number(form.priority),
        start_date: useSchedule && form.start_date ? localDatetimeInputToUTC(form.start_date) : null,
        end_date:   useSchedule && form.end_date   ? localDatetimeInputToUTC(form.end_date)   : null,
        conditions: Object.keys(conditions).length > 0 ? conditions : null,
        product_ids: form.type === 'SPECIFIC' ? form.product_ids : null,
      }, editingPromotion?.id);

      onClose();
    } catch (error) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPromotion ? 'Editar promoción' : 'Nueva promoción'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">

          {/* Nombre y descripción */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="promo-name">Nombre *</Label>
              <Input
                id="promo-name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ej: Black Friday 40%"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="promo-desc">Descripción</Label>
              <textarea
                id="promo-desc"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Descripción interna (solo visible en el panel)"
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          <Separator />

          {/* Alcance */}
          <div className="space-y-3">
            <Label>Alcance de la promoción</Label>
            <div className="grid grid-cols-2 gap-3">
              {['GLOBAL', 'SPECIFIC'].map(t => {
                const { icon: Icon, label, color: _ } = TYPE_LABELS[t];
                const isSelected = form.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('type', t)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                      isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-black' : 'text-gray-400'} />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">
                        {t === 'GLOBAL' ? 'Aplica a todos los productos' : 'Solo productos seleccionados'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {form.type === 'SPECIFIC' && (
              <div className="space-y-1">
                <Label>Productos incluidos *</Label>
                <ProductSearchMultiselect
                  selectedIds={form.product_ids}
                  onChange={ids => set('product_ids', ids)}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Descuento */}
          <div className="space-y-3">
            <Label>Tipo y valor de descuento</Label>
            <div className="flex gap-3">
              {['PERCENTAGE', 'FIXED_AMOUNT'].map(dt => {
                const { icon: Icon } = DISCOUNT_LABELS[dt];
                const isSelected = form.discount_type === dt;
                return (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => set('discount_type', dt)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition text-sm font-semibold ${
                      isSelected ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={14} />
                    {dt === 'PERCENTAGE' ? 'Porcentaje' : 'Monto fijo'}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  {form.discount_type === 'PERCENTAGE' ? '%' : '$'}
                </span>
                <Input
                  type="number"
                  value={form.value}
                  onChange={e => set('value', e.target.value)}
                  placeholder={form.discount_type === 'PERCENTAGE' ? '20' : '5000'}
                  min="0"
                  max={form.discount_type === 'PERCENTAGE' ? '100' : undefined}
                  className="pl-7"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="priority">Prioridad</Label>
                <Input
                  id="priority"
                  type="number"
                  value={form.priority}
                  onChange={e => set('priority', e.target.value)}
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-gray-400">Mayor número = mayor prioridad</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Programación */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="use-schedule"
                checked={useSchedule}
                onChange={e => setUseSchedule(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="use-schedule" className="cursor-pointer flex items-center gap-2">
                <Calendar size={14} />
                Programar fechas (Flash Sale)
              </Label>
            </div>
            {useSchedule && (
              <div className="pl-7 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="start-date">Inicio</Label>
                    <Input id="start-date" type="datetime-local" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date">Fin</Label>
                    <Input id="end-date" type="datetime-local" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={11} />
                  Las horas se interpretan en tu zona horaria local
                  {' '}({Intl.DateTimeFormat().resolvedOptions().timeZone}) y se guardan en UTC.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Condiciones adicionales */}
          <div className="space-y-3">
            <Label>Condiciones adicionales <span className="text-gray-400 font-normal">(opcionales)</span></Label>
            <div className="space-y-1">
              <Label htmlFor="min-purchase" className="text-xs text-gray-500">Monto mínimo de compra ($)</Label>
              <Input
                id="min-purchase"
                type="number"
                value={form.conditions.min_purchase}
                onChange={e => setCondition('min_purchase', e.target.value)}
                placeholder="Ej: 50000"
                min="0"
              />
            </div>
            {form.type === 'GLOBAL' && categories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Excluir categorías</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const isExcluded = (form.conditions.excluded_categories || []).includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleExcludedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          isExcluded
                            ? 'bg-red-50 border-red-200 text-red-600 line-through'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">Las categorías tachadas quedan excluidas del descuento</p>
              </div>
            )}
            {form.type === 'GLOBAL' && (
              <ExcludedBrandsInput
                value={form.conditions.excluded_brands || []}
                onChange={brands => setCondition('excluded_brands', brands)}
              />
            )}
          </div>

          <Separator />

          {/* Estado */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is-active"
              checked={form.is_active}
              onChange={e => set('is_active', e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <Label htmlFor="is-active" className="cursor-pointer">Activar inmediatamente</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : editingPromotion ? 'Actualizar' : 'Crear promoción'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}