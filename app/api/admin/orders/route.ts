import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('Failed to fetch orders', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, customerId, total, paymentMethod, isPos } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // Generate Order Number
    const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;

    // Create Order
    const res = await db.insert(orders).values({
      orderNumber,
      userId: customerId,
      subtotal: total.toString(),
      tax: '0',
      shippingCost: '0',
      discount: '0',
      total: total.toString(),
      status: 'delivered', // POS orders are completed immediately
      paymentStatus: 'paid',
      paymentMethod,
      isPosOrder: isPos || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // @ts-ignore
    const newOrder = res[0];
    const orderId = newOrder.id;

    // Create Order Items and Update Stock
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        productName: item.name || 'Unknown Product', // Assuming name is passed or we need to fetch it. Ideally passed to avoid extra query.
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        totalPrice: (item.price * item.quantity).toString()
      });

      // Update Stock
      // Note: This is not atomic without transaction, but fine for now.
      const product = await db.select().from(products).where(eq(products.id, item.productId));
      if (product.length > 0) {
        const currentStock = product[0].stockQuantity || 0;
        await db.update(products)
          .set({ stockQuantity: Math.max(0, currentStock - item.quantity) })
          .where(eq(products.id, item.productId));
      }
    }

    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Failed to create order', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
