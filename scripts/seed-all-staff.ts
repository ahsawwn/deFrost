/**
 * Seed All Staff Users Script
 * Creates admin, manager, and cashier users in one go
 * 
 * Usage:
 *   npx tsx scripts/seed-all-staff.ts
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set in .env.local');
  console.error('   Please create a .env.local file with your DATABASE_URL');
  process.exit(1);
}

import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid/non-secure';

const staffUsers = [
  {
    email: 'admin@defrost.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    email: 'manager@defrost.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager' as const,
  },
  {
    email: 'cashier@defrost.com',
    password: 'cashier123',
    name: 'Cashier User',
    role: 'cashier' as const,
  },
];

async function seedAllStaff() {
  try {
    console.log('🌱 Starting staff users seed...\n');

    for (const staff of staffUsers) {
      try {
        // Check if user already exists
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, staff.email))
          .limit(1);

        if (existingUser) {
          console.log(`⚠️  ${staff.role.toUpperCase()}: User already exists (${staff.email})`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(staff.password, 10);

        // Create user
        const userId = nanoid();
        const [newUser] = await db
          .insert(users)
          .values({
            id: userId,
            email: staff.email,
            name: staff.name,
            password: hashedPassword,
            role: staff.role,
            emailVerified: new Date(),
          })
          .returning();

        console.log(`✅ ${staff.role.toUpperCase()}: Created successfully`);
        console.log(`   Email: ${staff.email}`);
        console.log(`   Password: ${staff.password}`);
        console.log(`   Name: ${staff.name}\n`);
      } catch (error: any) {
        console.error(`❌ Error creating ${staff.role}:`, error.message);
      }
    }

    console.log('\n📋 Summary:');
    console.log('   All staff users have been processed.');
    console.log('\n💡 Login at: /admin/login');
    console.log('   This is separate from shop user login at: /login');
    console.log('\n🔑 Default Credentials:');
    staffUsers.forEach((staff) => {
      console.log(`   ${staff.role.toUpperCase()}: ${staff.email} / ${staff.password}`);
    });

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding staff users:', error);
    process.exit(1);
  }
}

seedAllStaff();

