import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cart } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCart = await db.select().from(cart).where(eq(cart.userId, userId));
    return NextResponse.json(userCart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newCartItem = await db.insert(cart).values({
      ...body,
      userId,
    }).returning();
    
    return NextResponse.json(newCartItem[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

