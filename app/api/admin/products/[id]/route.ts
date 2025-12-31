import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = parseInt(params.id);
    
    // Soft delete by setting isActive to false
    await db
      .update(products)
      .set({ isActive: false })
      .where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = parseInt(params.id);
    const body = await request.json();

    const updatedProduct = await db
      .update(products)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

