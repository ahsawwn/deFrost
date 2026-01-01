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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg font-medium"
          >
            Add Product
          </Link>
          <Link
            href="/admin/pos"
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-medium"
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
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</CardTitle>
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <p className="text-sm text-gray-500 mb-3">{stat.description}</p>
                    {stat.change !== 0 && (
                      <div className="flex items-center">
                        {isPositive ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">
                              +{Math.abs(stat.change)}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg">
                            <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                            <span className="text-xs font-semibold text-red-600">
                              -{Math.abs(stat.change)}%
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500 ml-2">vs last month</span>
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
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your store</CardDescription>
                  </div>
                  <Link
                    href="/admin/orders"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                  >
                    View all
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">No orders yet</p>
                    <p className="text-sm text-gray-500">Orders will appear here once customers start purchasing</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{order.customerName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">{order.total}</p>
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
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Low Stock Alert</CardTitle>
                <CardDescription>Products running low on inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Package className="h-7 w-7 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">All products in stock</p>
                    <p className="text-xs text-gray-500">No low stock alerts</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/admin/products?edit=${product.id}`}
                        className="block p-3 border-2 border-red-100 bg-red-50/50 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all"
                      >
                        <p className="font-semibold text-sm text-gray-900 mb-1">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            {product.stockQuantity} left
                          </span>
                          <span className="text-xs text-gray-600">
                            Min: {product.lowStockThreshold}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <Link
                        href="/admin/inventory"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium text-center block pt-2"
                      >
                        View all {lowStockProducts.length} products →
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-3 p-3.5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Add New Product</span>
                </Link>
                <Link
                  href="/admin/pos"
                  className="flex items-center gap-3 p-3.5 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-all group"
                >
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Open POS</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 p-3.5 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                >
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">View Analytics</span>
                </Link>
                <Link
                  href="/admin/inventory"
                  className="flex items-center gap-3 p-3.5 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Manage Inventory</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
