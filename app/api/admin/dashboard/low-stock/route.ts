import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { and, eq, lte } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
      })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          lte(products.stockQuantity, products.lowStockThreshold)
        )
      )
      .orderBy(products.stockQuantity);

    return NextResponse.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}

