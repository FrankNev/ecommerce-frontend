'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authAPI } from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.post('/api/auth/register', form);
      setAuth(data.user, data.token);
      toast.success('¡Cuenta creada correctamente!');
      router.push('/');
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || 'Error al registrarse');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-black font-semibold hover:underline">
              Iniciá sesión
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}