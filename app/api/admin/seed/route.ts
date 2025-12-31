import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/admin-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid/non-secure';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'admin' } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'cashier'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if admin user already exists
    const [existingUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin/manager/cashier user
    const userId = nanoid();
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        id: userId,
        email,
        name: name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        password: hashedPassword,
        role: role as 'admin' | 'manager' | 'cashier',
        emailVerified: new Date(), // Auto-verify admin users
        isActive: true,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully`,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error seeding admin user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

