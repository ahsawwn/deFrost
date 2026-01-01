import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expenses } from '@/lib/db/admin-schema';
import { auth } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allExpenses = await db.select().from(expenses).orderBy(desc(expenses.date));
    return NextResponse.json(allExpenses);
  } catch (error) {
    console.error('Failed to fetch expenses', error);
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
    const { description, amount, category, date } = body;

    if (!description || !amount || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await db.insert(expenses).values({
      description,
      amount: amount.toString(),
      category,
      date: date ? new Date(date) : new Date(),
      recordedBy: session.user.id
    }).returning();

    // @ts-ignore
    const newExpense = res[0];

    return NextResponse.json(newExpense);
  } catch (error) {
    console.error('Failed to create expense', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
