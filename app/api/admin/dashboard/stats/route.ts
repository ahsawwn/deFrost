import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, orders, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { sql, eq, and, gte, lte } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current month start and end
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Sales (current month)
    const currentMonthSales = await db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, currentMonthStart),
          eq(orders.paymentStatus, 'paid')
        )
      );

    // Last month sales
    const lastMonthSales = await db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, lastMonthStart),
          lte(orders.createdAt, lastMonthEnd),
          eq(orders.paymentStatus, 'paid')
        )
      );

    // Total Orders
    const totalOrdersResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders);

    const currentMonthOrders = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, currentMonthStart));

    const lastMonthOrders = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, lastMonthStart),
          lte(orders.createdAt, lastMonthEnd)
        )
      );

    // Total Products
    const totalProducts = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .where(eq(products.isActive, true));

    // Total Customers
    const totalCustomers = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(users)
      .where(eq(users.role, 'customer'));

    const currentMonthCustomers = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(users)
      .where(
        and(
          gte(users.createdAt, currentMonthStart),
          eq(users.role, 'customer')
        )
      );

    const lastMonthCustomers = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(users)
      .where(
        and(
          gte(users.createdAt, lastMonthStart),
          lte(users.createdAt, lastMonthEnd),
          eq(users.role, 'customer')
        )
      );

    const totalSales = Number(currentMonthSales[0]?.total || 0);
    const lastMonthSalesTotal = Number(lastMonthSales[0]?.total || 0);
    const totalOrders = Number(totalOrdersResult[0]?.count || 0);
    const currentMonthOrdersCount = Number(currentMonthOrders[0]?.count || 0);
    const lastMonthOrdersCount = Number(lastMonthOrders[0]?.count || 0);
    const totalProductsCount = Number(totalProducts[0]?.count || 0);
    const totalCustomersCount = Number(totalCustomers[0]?.count || 0);
    const currentMonthCustomersCount = Number(currentMonthCustomers[0]?.count || 0);
    const lastMonthCustomersCount = Number(lastMonthCustomers[0]?.count || 0);

    // Calculate percentage changes
    const revenueChange =
      lastMonthSalesTotal > 0
        ? Math.round(((totalSales - lastMonthSalesTotal) / lastMonthSalesTotal) * 100)
        : 0;
    const ordersChange =
      lastMonthOrdersCount > 0
        ? Math.round(((currentMonthOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) * 100)
        : 0;
    const customersChange =
      lastMonthCustomersCount > 0
        ? Math.round(((currentMonthCustomersCount - lastMonthCustomersCount) / lastMonthCustomersCount) * 100)
        : 0;

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalProducts: totalProductsCount,
      totalCustomers: totalCustomersCount,
      salesChange: revenueChange,
      ordersChange,
      revenueChange,
      customersChange,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

