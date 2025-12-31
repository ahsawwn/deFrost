/**
 * Seed Admin Users Script (Using Admin Schema)
 * 
 * Usage:
 *   npx tsx scripts/seed-admin-users.ts
 * 
 * Or with custom values:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword ADMIN_NAME="Admin Name" ADMIN_ROLE=admin npx tsx scripts/seed-admin-users.ts
 * 
 * Roles: admin, manager, cashier
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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@defrost.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_ROLE = (process.env.ADMIN_ROLE || 'admin') as 'admin' | 'manager' | 'cashier';

// Validate role
const validRoles = ['admin', 'manager', 'cashier'];
if (!validRoles.includes(ADMIN_ROLE)) {
  console.error(`❌ Invalid role: ${ADMIN_ROLE}. Must be one of: ${validRoles.join(', ')}`);
  process.exit(1);
}

async function seedAdminUser() {
  try {
    // Dynamic import after env vars are loaded
    const { db } = await import('../lib/db');
    const { adminUsers } = await import('../lib/db/admin-schema');
    
    console.log('🌱 Starting admin user seed (Admin Schema)...');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`👤 Name: ${ADMIN_NAME}`);
    console.log(`🔑 Role: ${ADMIN_ROLE}`);

    // Check if admin user already exists
    const [existingUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, ADMIN_EMAIL))
      .limit(1);

    if (existingUser) {
      console.log('⚠️  Admin user already exists with this email!');
      console.log(`   Current role: ${existingUser.role}`);
      console.log('   If you want to update, delete the user first or use a different email.');
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const userId = nanoid();
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        id: userId,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: ADMIN_ROLE,
        emailVerified: new Date(), // Auto-verify admin users
        isActive: true,
      })
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 User Details:');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Role: ${newUser.role}`);
    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n💡 You can now login at: /admin/login');
    console.log('   This is separate from shop user login at: /login');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdminUser();

