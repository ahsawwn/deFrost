import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyCode } from '@/lib/email-verification';
import { registerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid/non-secure';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, code } = body;

    // Validate input
    const validation = registerSchema.safeParse({ email, password, name, phone });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Verify the code
    const isValidCode = await verifyCode(email, code);
    if (!isValidCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if user already exists (double check)
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = nanoid();
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        emailVerified: new Date(),
        role: 'customer',
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

