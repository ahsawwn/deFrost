'use client';

import { useState } from 'react';
import { Package, Search, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');

  // Mock orders data - replace with actual API call
  const orders = [
    {
      id: 'ORD-001',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      items: [
        { name: 'Futuristic Tech Tee', quantity: 1, price: 1299 },
        { name: 'Neon Glow Hoodie', quantity: 1, price: 2499 },
      ],
      total: 3798,
      status: 'Delivered',
      paymentStatus: 'Paid',
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-10',
      items: [{ name: 'Cyber Pants', quantity: 1, price: 1999 }],
      total: 1999,
      status: 'Processing',
      paymentStatus: 'Paid',
    },
    {
      id: 'ORD-003',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-05',
      items: [
        { name: 'Digital Wave Cap', quantity: 2, price: 799 },
        { name: 'Futuristic Tech Tee', quantity: 1, price: 1299 },
      ],
      total: 2897,
      status: 'Shipped',
      paymentStatus: 'Paid',
    },
  ];

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === filter.toLowerCase());

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-gray-600">View and track your orders</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      Ordered on {new Date(order.date).toLocaleDateString()}
                    </p>

                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-600">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
                    </div>

                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

