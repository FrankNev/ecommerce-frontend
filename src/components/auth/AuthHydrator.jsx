'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function AuthHydrator() {
  const hydrate = useAuthStore(state => state.hydrate);
  useEffect(() => {
    hydrate();
  }, []);
  return null;
}