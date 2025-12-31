'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut,
  Home,
  Warehouse,
} from 'lucide-react';
import ThemeToggle from '@/components/admin/ThemeToggle';
import { useAdminSession } from '@/hooks/useAdminSession';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useAdminSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Don't redirect if we're already on the login page
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    } else if (status === 'authenticated' && !isLoginPage) {
      // Check if user has admin role (admin, manager, or cashier)
      const adminRoles = ['admin', 'manager', 'cashier'];
      if (!session?.user?.role || !adminRoles.includes(session.user.role)) {
        router.push('/');
      }
    }
  }, [status, session, router, isLoginPage]);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/admin/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/admin/login');
    }
  };

  // If we're on the login page, just render the children without the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Warehouse, label: 'Inventory', href: '/admin/inventory' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <Link href="/admin/dashboard" className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">DeFrost Admin</h1>
          </Link>

          {/* User Info */}
          {session?.user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold text-sm">{session.user.name || 'Admin'}</p>
              <p className="text-gray-600 text-xs">{session.user.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">View Store</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-end">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
