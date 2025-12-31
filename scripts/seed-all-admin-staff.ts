/**
 * Seed All Admin Staff Users Script (Using Admin Schema)
 * 
 * Creates multiple admin users: admin, manager, and cashier
 * 
 * Usage:
 *   npx tsx scripts/seed-all-admin-staff.ts
 */

// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Try loading .env.local first, then .env
config({ path: resolve(process.cwd(), '.env.local') });
if (!process.env.DATABASE_URL) {
  config({ path: resolve(process.cwd(), '.env') });
}

// Check if DATABASE_URL is set BEFORE importing db
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set');
  console.error('   Please create a .env.local or .env file with your DATABASE_URL');
  console.error('   Example: DATABASE_URL=postgresql://user:password@host:port/database');
  process.exit(1);
}

// Import after env vars are loaded
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

async function seedAllAdminStaff() {
  try {
    // Dynamic import after env vars are loaded
    const { db } = await import('../lib/db');
    const { adminUsers } = await import('../lib/db/admin-schema');
    
    console.log('🌱 Starting admin staff users seed (Admin Schema)...\n');

    for (const staff of staffUsers) {
      try {
        // Check if user already exists
        const [existingUser] = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, staff.email))
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
          .insert(adminUsers)
          .values({
            id: userId,
            email: staff.email,
            name: staff.name,
            password: hashedPassword,
            role: staff.role,
            emailVerified: new Date(),
            isActive: true,
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
    console.log('   All admin staff users have been processed.');
    console.log('\n💡 Login at: /admin/login');
    console.log('   This is separate from shop user login at: /login');
    console.log('\n🔑 Default Credentials:');
    staffUsers.forEach((staff) => {
      console.log(`   ${staff.role.toUpperCase()}: ${staff.email} / ${staff.password}`);
    });

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding admin staff users:', error);
    process.exit(1);
  }
}

seedAllAdminStaff();

