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
                <svg className="w-5 h-5" fill="rgb(74, 85, 101)" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
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
