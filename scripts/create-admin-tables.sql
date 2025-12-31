-- Create Admin Schema Tables
-- Run this SQL script directly in your database if db:push fails

-- Create admin_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM ('admin', 'manager', 'cashier');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admin_user table
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

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "admin_user_email_unique" ON "admin_user"("email");

-- Create admin_account table
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

-- Add foreign key
DO $$ BEGIN
    ALTER TABLE "admin_account" ADD CONSTRAINT "admin_account_user_id_admin_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "admin_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admin_session table
CREATE TABLE IF NOT EXISTS "admin_session" (
    "session_token" varchar PRIMARY KEY NOT NULL,
    "user_id" varchar,
    "expires" timestamp
);

-- Add foreign key
DO $$ BEGIN
    ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_user_id_admin_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "admin_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admin_verification_token table
CREATE TABLE IF NOT EXISTS "admin_verification_token" (
    "identifier" varchar NOT NULL,
    "token" varchar NOT NULL,
    "expires" timestamp,
    CONSTRAINT "admin_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);

