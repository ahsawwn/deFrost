'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session) {
      // Only allow customer users - redirect admin users away
      const adminRoles = ['admin', 'manager', 'cashier'];
      if (session.user?.role && adminRoles.includes(session.user.role)) {
        // Admin users should use admin panel, not user profile
        router.push('/admin/dashboard');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
