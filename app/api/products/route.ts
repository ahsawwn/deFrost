import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, and, like, or, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    let conditions = [eq(products.isActive, true)];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true));
    }

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }

    let query = db
      .select()
      .from(products)
      .where(and(...conditions));

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const allProducts = await query;

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

