'use client';

import { useSession } from 'next-auth/react';
import { ShoppingBag, Package, DollarSign, Ticket } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session } = useSession();

  // Mock data - replace with actual API calls
  const stats = [
    { label: 'Total Orders', value: '12', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Pending Orders', value: '3', icon: Package, color: 'text-yellow-400' },
    { label: 'Total Spent', value: '₹24,990', icon: DollarSign, color: 'text-green-400' },
    { label: 'Active Coupons', value: '2', icon: Ticket, color: 'text-purple-400' },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: 2,
      total: '₹3,499',
      status: 'Delivered',
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      items: 1,
      total: '₹1,999',
      status: 'Processing',
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      items: 3,
      total: '₹5,999',
      status: 'Shipped',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link
              href="/profile/orders"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold mb-1">{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {order.items} items • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold mb-1">{order.total}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/shop"
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Continue Shopping</h3>
            <p className="text-gray-600 text-sm">Browse our latest collection</p>
          </Link>

          <Link
            href="/profile/coupons"
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">View Coupons</h3>
            <p className="text-gray-600 text-sm">Check available discounts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
