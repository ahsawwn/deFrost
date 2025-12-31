import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}

