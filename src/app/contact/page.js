'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const CONTACT_INFO = {
  phone: '+54 11 1234-5678',
  email: 'contacto@mitienda.com',
  instagram: '@mitienda',
  address: 'Av. Corrientes 1234, Buenos Aires',
  hours: 'Lunes a Viernes: 9:00 - 18:00\nSábado: 10:00 - 16:00',
};

export default function ContactPage() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { nombre, email, telefono, mensaje } = form;

    if (!nombre.trim()) {
      toast.error('El nombre es requerido');
      return false;
    }
    if (!email.trim()) {
      toast.error('El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Ingresá un email válido');
      return false;
    }
    if (!telefono.trim()) {
      toast.error('El teléfono es requerido');
      return false;
    }
    if (!mensaje.trim()) {
      toast.error('El mensaje es requerido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await ecommerceAPI.post('/api/contact/send-email', form);
      toast.success('¡Mensaje enviado! Nos pondremos en contacto pronto.');
      setForm({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">¿Tenés dudas?</h1>
        <p className="text-xl text-gray-600">Hacenos tu consulta y nos pondremos en contacto a la brevedad</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
          gap: '2rem',
        }}
      >
        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="mensaje">Mensaje *</Label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  rows={6}
                  disabled={loading}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-y"
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Contactanos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Teléfono */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <p className="font-semibold text-gray-900">Teléfono</p>
              </div>
              <p className="text-gray-600 ml-8">{CONTACT_INFO.phone}</p>
            </div>

            <Separator />

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <p className="font-semibold text-gray-900">Email</p>
              </div>
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-600 ml-8 hover:text-black transition">
                {CONTACT_INFO.email}
              </a>
            </div>

            <Separator />

            {/* Instagram */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-gray-900">Instagram</p>
              </div>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-600 ml-8 hover:text-black transition">
                {CONTACT_INFO.instagram}
              </a>
            </div>

            <Separator />

            {/* Dirección */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <p className="font-semibold text-gray-900">Dirección</p>
              </div>
              <p className="text-gray-600 ml-8">{CONTACT_INFO.address}</p>
            </div>

            <Separator />

            {/* Horarios */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <p className="font-semibold text-gray-900">Horarios</p>
              </div>
              <div className="text-gray-600 ml-8 whitespace-pre-line">
                {CONTACT_INFO.hours}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
