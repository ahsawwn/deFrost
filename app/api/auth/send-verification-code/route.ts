import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateVerificationCode, storeVerificationCode, sendVerificationEmail } from '@/lib/email-verification';
import { z } from 'zod';

const sendCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = sendCodeSchema.parse(body);

    // Check if user already exists
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

    // Generate and store verification code
    const code = generateVerificationCode();
    await storeVerificationCode(email, code);

    // Send verification email
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      message: 'Verification code sent to your email',
      // In development, return code for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

