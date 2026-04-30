'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Zap } from 'lucide-react';
import { ecommerceAPI } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PromotionStatsRow  from './promotions/PromotionStatsRow';
import PromotionCard      from './promotions/PromotionCard';
import PromotionFormDialog from './promotions/PromotionFormDialog';
import PricePreviewDialog  from './promotions/PricePreviewDialog';

export default function AdminPromotions() {
  const [promotions, setPromotions]       = useState([]);
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [formOpen, setFormOpen]           = useState(false);
  const [editingPromotion, setEditing]    = useState(null);
  const [previewPromo, setPreviewPromo]   = useState(null);
  const [expandedId, setExpandedId]       = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [promosRes, catsRes] = await Promise.all([
        ecommerceAPI.get('/api/promotions'),
        ecommerceAPI.get('/api/categories'),
      ]);
      setPromotions(promosRes.data);
      setCategories(catsRes.data);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload, id) => {
    try {
      if (id) {
        const { data } = await ecommerceAPI.put(`/api/promotions/${id}`, payload);
        setPromotions(prev => prev.map(p => p.id === id ? data : p));
        toast.success('Promoción actualizada');
      } else {
        const { data } = await ecommerceAPI.post('/api/promotions', payload);
        setPromotions(prev => [data, ...prev]);
        toast.success('Promoción creada');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al guardar');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await ecommerceAPI.patch(`/api/promotions/${id}/toggle`);
      setPromotions(prev => prev.map(p => p.id === id ? data : p));
      toast.success(data.is_active ? 'Promoción activada' : 'Promoción desactivada');
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminás esta promoción? Esta acción no se puede deshacer.')) return;
    try {
      await ecommerceAPI.delete(`/api/promotions/${id}`);
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast.success('Promoción eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const openNew  = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (promo) => { setEditing(promo); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  if (loading) {
    return <div className="py-16 text-center text-gray-400 text-sm">Cargando promociones...</div>;
  }

  return (
    <>
      <PromotionStatsRow promotions={promotions} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Promociones ({promotions.length})</CardTitle>
            <Button size="sm" onClick={openNew}>
              <Plus size={14} />
              Nueva promoción
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {promotions.length === 0 ? (
            <div className="py-16 text-center">
              <Zap size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No hay promociones todavía.</p>
              <Button size="sm" className="mt-4" onClick={openNew}>
                Crear la primera oferta
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {promotions.map(promo => (
                <PromotionCard
                  key={promo.id}
                  promo={promo}
                  isExpanded={expandedId === promo.id}
                  categories={categories}
                  onToggleExpand={() => toggleExpand(promo.id)}
                  onPreview={() => setPreviewPromo(promo)}
                  onToggleActive={() => handleToggle(promo.id)}
                  onEdit={() => openEdit(promo)}
                  onDelete={() => handleDelete(promo.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PromotionFormDialog
        open={formOpen}
        onClose={closeForm}
        onSave={handleSave}
        editingPromotion={editingPromotion}
        categories={categories}
      />

      <PricePreviewDialog
        open={!!previewPromo}
        onClose={() => setPreviewPromo(null)}
        promotion={previewPromo}
      />
    </>
  );
}