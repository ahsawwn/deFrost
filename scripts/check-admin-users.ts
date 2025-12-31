/**
 * Check Admin Users Script
 * 
 * This script checks if admin users exist in the database
 * 
 * Usage:
 *   npx tsx scripts/check-admin-users.ts
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
  process.exit(1);
}

async function checkAdminUsers() {
  try {
    // Dynamic import after env vars are loaded
    const { db } = await import('../lib/db');
    const { adminUsers } = await import('../lib/db/admin-schema');
    
    console.log('🔍 Checking admin users in database...\n');

    const users = await db.select().from(adminUsers);

    if (users.length === 0) {
      console.log('⚠️  No admin users found in the database!');
      console.log('\n💡 To create admin users, run:');
      console.log('   npm run seed:admin-users');
      console.log('   or');
      console.log('   npm run seed:admin-staff');
    } else {
      console.log(`✅ Found ${users.length} admin user(s):\n`);
      users.forEach((user) => {
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error: any) {
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      console.error('❌ Admin tables do not exist!');
      console.error('\n💡 To create admin tables, run:');
      console.error('   npm run create:admin-tables');
    } else {
      console.error('❌ Error checking admin users:', error.message);
    }
    process.exit(1);
  }
}

checkAdminUsers();

