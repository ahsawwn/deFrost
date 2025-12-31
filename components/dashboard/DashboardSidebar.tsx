'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  User, 
  ShoppingBag, 
  Ticket, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Profile', href: '/profile' },
  { icon: User, label: 'Settings', href: '/profile/settings' },
  { icon: ShoppingBag, label: 'Orders', href: '/profile/orders' },
  { icon: Ticket, label: 'Coupons', href: '/profile/coupons' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <Link href="/" className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">DeFrost</h1>
          </Link>

          {/* User Info */}
          {session?.user && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">{session.user.name || 'User'}</p>
              <p className="text-gray-600 text-sm">{session.user.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

