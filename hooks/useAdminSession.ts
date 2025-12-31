'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/admin/auth/session', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.session) {
            setSession(data.session);
            setStatus('authenticated');
          } else {
            setSession(null);
            setStatus('unauthenticated');
          }
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Error fetching admin session:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  return { data: session, status };
}

