"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore'; 

export default function OAuthCallback() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash.startsWith('#token=')) {
      const token = hash.replace('#token=', '');
      
      const payload = JSON.parse(atob(token.split('.')[1])); 
      
      setAuth({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      }, token);
      
      router.replace('/'); 
    } else {
      router.replace('/login');
    }
  }, [router, setAuth]);

  return <div className="p-10 text-center">Completando registro e iniciando sesión...</div>;
}