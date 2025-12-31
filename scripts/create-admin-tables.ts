/**
 * Create Admin Tables Script
 * 
 * This script creates the admin schema tables directly in the database
 * without modifying existing tables.
 * 
 * Usage:
 *   npx tsx scripts/create-admin-tables.ts
 */

// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Try loading .env.local first, then .env
config({ path: resolve(process.cwd(), '.env.local') });
if (!process.env.DATABASE_URL) {
  config({ path: resolve(process.cwd(), '.env') });
}

// Check if DATABASE_URL is set BEFORE importing neon
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set');
  console.error('   Please create a .env.local or .env file with your DATABASE_URL');
  console.error('   Example: DATABASE_URL=postgresql://user:password@host:port/database');
  process.exit(1);
}

// Now import after env vars are loaded
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function createAdminTables() {
  try {
    console.log('🌱 Creating admin schema tables...\n');

    // Create admin_role enum if it doesn't exist
    console.log('📋 Creating admin_role enum...');
    await sql`
      DO $$ BEGIN
          CREATE TYPE admin_role AS ENUM ('admin', 'manager', 'cashier');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✅ admin_role enum created/verified\n');

    // Create admin_user table
    console.log('📋 Creating admin_user table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_user" (
          "id" varchar PRIMARY KEY NOT NULL,
          "name" varchar,
          "email" varchar NOT NULL,
          "email_verified" timestamp,
          "password" varchar,
          "role" admin_role DEFAULT 'admin',
          "image" varchar,
          "phone" varchar(20),
          "is_active" boolean DEFAULT true,
          "last_login" timestamp,
          "created_at" timestamp DEFAULT now(),
          "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log('✅ admin_user table created\n');

    // Create unique index on email
    console.log('📋 Creating email unique index...');
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "admin_user_email_unique" ON "admin_user"("email");
    `;
    console.log('✅ Email unique index created\n');

    // Create admin_account table
    console.log('📋 Creating admin_account table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_account" (
          "user_id" varchar,
          "type" varchar,
          "provider" varchar NOT NULL,
          "provider_account_id" varchar NOT NULL,
          "refresh_token" text,
          "access_token" text,
          "expires_at" integer,
          "token_type" varchar,
          "scope" varchar,
          "id_token" text,
          "session_state" varchar,
          CONSTRAINT "admin_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
      );
    `;
    console.log('✅ admin_account table created\n');

    // Add foreign key for admin_account
    console.log('📋 Adding foreign key for admin_account...');
    await sql`
      DO $$ BEGIN
          ALTER TABLE "admin_account" ADD CONSTRAINT "admin_account_user_id_admin_user_id_fk" 
          FOREIGN KEY ("user_id") REFERENCES "admin_user"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✅ Foreign key added\n');

    // Create admin_session table
    console.log('📋 Creating admin_session table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_session" (
          "session_token" varchar PRIMARY KEY NOT NULL,
          "user_id" varchar,
          "expires" timestamp
      );
    `;
    console.log('✅ admin_session table created\n');

    // Add foreign key for admin_session
    console.log('📋 Adding foreign key for admin_session...');
    await sql`
      DO $$ BEGIN
          ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_user_id_admin_user_id_fk" 
          FOREIGN KEY ("user_id") REFERENCES "admin_user"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✅ Foreign key added\n');

    // Create admin_verification_token table
    console.log('📋 Creating admin_verification_token table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_verification_token" (
          "identifier" varchar NOT NULL,
          "token" varchar NOT NULL,
          "expires" timestamp,
          CONSTRAINT "admin_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
      );
    `;
    console.log('✅ admin_verification_token table created\n');

    console.log('🎉 All admin tables created successfully!');
    console.log('\n📋 Created tables:');
    console.log('   - admin_user');
    console.log('   - admin_account');
    console.log('   - admin_session');
    console.log('   - admin_verification_token');
    console.log('\n💡 You can now run: npm run seed:admin-users');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin tables:', error.message);
    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Some tables may already exist. This is okay!');
      console.log('   You can proceed to seed admin users.');
    }
    process.exit(1);
  }
}

createAdminTables();

