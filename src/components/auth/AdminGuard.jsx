'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function AdminGuard({ children }) {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
  }, [mounted, user]);

  if (!mounted || !user || user.role !== 'admin') {
    return null; // No renderiza nada hasta verificar
  }

  return children;
}