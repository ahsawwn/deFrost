'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesChange: number;
  ordersChange: number;
  revenueChange: number;
  customersChange: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  total: string;
  status: string;
  createdAt: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesChange: 0,
    ordersChange: 0,
    revenueChange: 0,
    customersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/dashboard/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch recent orders
      const ordersRes = await fetch('/api/admin/dashboard/recent-orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData);
      }

      // Fetch low stock products
      const stockRes = await fetch('/api/admin/dashboard/low-stock');
      if (stockRes.ok) {
        const stockData = await stockRes.json();
        setLowStockProducts(stockData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalSales),
      change: stats.revenueChange,
      icon: DollarSign,
      description: 'Total sales revenue',
      href: '/admin/analytics',
    },
    {
      title: 'Orders',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      description: 'Total orders placed',
      href: '/admin/orders',
    },
    {
      title: 'Products',
      value: stats.totalProducts.toString(),
      change: 0,
      icon: Package,
      description: 'Active products',
      href: '/admin/products',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: Users,
      description: 'Total customers',
      href: '/admin/analytics',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Product
            </Link>
            <Link
              href="/admin/pos"
              className="px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              POS System
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    {stat.change !== 0 && (
                      <div className="flex items-center mt-2">
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {Math.abs(stat.change)}% from last month
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your store</CardDescription>
                  </div>
                  <Link
                    href="/admin/orders"
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    View all
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Low Stock & Quick Actions */}
          <div className="space-y-6">
            {/* Low Stock Products */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Products running low on inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">All products in stock</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/admin/products?edit=${product.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium text-sm text-gray-900">{product.name}</p>
                        <p className="text-xs text-red-600 mt-1">
                          Only {product.stockQuantity} left (threshold: {product.lowStockThreshold})
                        </p>
                      </Link>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <Link
                        href="/admin/inventory"
                        className="text-sm text-gray-600 hover:text-gray-900 text-center block"
                      >
                        View all {lowStockProducts.length} products
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Package className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Add New Product</span>
                </Link>
                <Link
                  href="/admin/pos"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Open POS</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </Link>
                <Link
                  href="/admin/inventory"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Activity className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Inventory</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
