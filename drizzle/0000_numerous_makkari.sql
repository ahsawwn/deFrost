CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'card', 'upi', 'netbanking');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin', 'manager', 'cashier', 'staff');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('admin', 'manager', 'cashier');--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" varchar,
	"type" varchar,
	"provider" varchar,
	"provider_account_id" varchar,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar,
	"scope" varchar,
	"id_token" text,
	"session_state" varchar,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"session_id" varchar(255),
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"size" varchar(50),
	"color" varchar(50),
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(500),
	"parent_id" integer,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"size" varchar(50),
	"color" varchar(50),
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(100) NOT NULL,
	"user_id" varchar,
	"customer_name" varchar(255),
	"customer_email" varchar(255),
	"customer_phone" varchar(20),
	"shipping_address" jsonb,
	"billing_address" jsonb,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0',
	"shipping_cost" numeric(10, 2) DEFAULT '0',
	"discount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"status" "order_status" DEFAULT 'pending',
	"payment_status" "payment_status" DEFAULT 'pending',
	"payment_method" "payment_method",
	"transaction_id" varchar(255),
	"notes" text,
	"is_pos_order" boolean DEFAULT false,
	"pos_session_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "pos_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_code" varchar(50) NOT NULL,
	"admin_id" varchar NOT NULL,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp,
	"starting_cash" numeric(10, 2) DEFAULT '0',
	"total_sales" numeric(10, 2) DEFAULT '0',
	"total_transactions" integer DEFAULT 0,
	"cash_in_hand" numeric(10, 2) DEFAULT '0',
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pos_sessions_session_code_unique" UNIQUE("session_code")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"compare_price" numeric(10, 2),
	"cost_price" numeric(10, 2),
	"images" jsonb DEFAULT '[]'::jsonb,
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"sizes" jsonb DEFAULT '["S","M","L","XL"]'::jsonb,
	"colors" jsonb DEFAULT '[]'::jsonb,
	"stock_quantity" integer DEFAULT 0,
	"low_stock_threshold" integer DEFAULT 10,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_sku_unique" UNIQUE("sku"),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar NOT NULL,
	"email_verified" timestamp,
	"password" varchar,
	"role" "user_role" DEFAULT 'customer',
	"image" varchar,
	"phone" varchar(20),
	"address" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" varchar,
	"token" varchar,
	"expires" timestamp,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "admin_account" (
	"user_id" varchar,
	"type" varchar,
	"provider" varchar,
	"provider_account_id" varchar,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar,
	"scope" varchar,
	"id_token" text,
	"session_state" varchar,
	CONSTRAINT "admin_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "admin_session" (
	"session_token" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "admin_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar NOT NULL,
	"email_verified" timestamp,
	"password" varchar,
	"role" "admin_role" DEFAULT 'admin',
	"image" varchar,
	"phone" varchar(20),
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "admin_verification_token" (
	"identifier" varchar,
	"token" varchar,
	"expires" timestamp,
	CONSTRAINT "admin_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_admin_id_admin_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_account" ADD CONSTRAINT "admin_account_user_id_admin_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_user_id_admin_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_user"("id") ON DELETE no action ON UPDATE no action;