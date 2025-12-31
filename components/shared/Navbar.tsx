'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState<string | null>(null);
  
  // Only show profile for regular customers, not admin users
  const isCustomer = session?.user?.role === 'customer' || (!session?.user?.role && session);
  const isAdmin = session?.user?.role && ['admin', 'manager', 'cashier'].includes(session.user.role);

  const categories = [
    { name: 'Men', href: '/shop?category=men' },
    { name: 'Women', href: '/shop?category=women' },
    { name: 'Juniors', href: '/shop?category=juniors' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            DeFrost
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                onMouseEnter={() => setCategoryMenu(category.name)}
                onMouseLeave={() => setCategoryMenu(null)}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-900" />
            </button>

            {/* User Account */}
            {isCustomer ? (
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Profile</span>
              </Link>
            ) : isAdmin ? (
              <Link
                href="/admin/dashboard"
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Admin</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Log in</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-900" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {isCustomer ? (
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              ) : isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in / Sign up
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Category Dropdown Menu (Desktop) */}
        {categoryMenu && (
          <div
            className="hidden lg:block absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
            onMouseEnter={() => setCategoryMenu(categoryMenu)}
            onMouseLeave={() => setCategoryMenu(null)}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">New In</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="/shop?category=new" className="hover:text-gray-900">View All</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shop by Category</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="/shop?category=hoodies" className="hover:text-gray-900">Hoodies</Link></li>
                    <li><Link href="/shop?category=tshirts" className="hover:text-gray-900">T-Shirts</Link></li>
                    <li><Link href="/shop?category=jeans" className="hover:text-gray-900">Jeans</Link></li>
                    <li><Link href="/shop?category=jackets" className="hover:text-gray-900">Jackets</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Collections</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="/shop?collection=essentials" className="hover:text-gray-900">Essentials</Link></li>
                    <li><Link href="/shop?collection=featured" className="hover:text-gray-900">Featured</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Help</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
                    <li><Link href="/track-order" className="hover:text-gray-900">Track Order</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
