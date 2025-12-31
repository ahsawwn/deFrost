import { pgTable, serial, varchar, integer, decimal, boolean, jsonb, timestamp, text, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { adminUsers } from './admin-schema';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'manager', 'cashier', 'staff']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'card', 'upi', 'netbanking']);

// Users (NextAuth compatible)
export const users = pgTable('user', {
  id: varchar('id').primaryKey(),
  name: varchar('name'),
  email: varchar('email').unique().notNull(),
  emailVerified: timestamp('email_verified'),
  password: varchar('password'),
  role: userRoleEnum('role').default('customer'),
  image: varchar('image'),
  phone: varchar('phone', { length: 20 }),
  address: jsonb('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// NextAuth additional tables
export const accounts = pgTable('account', {
  userId: varchar('user_id').references(() => users.id),
  type: varchar('type'),
  provider: varchar('provider'),
  providerAccountId: varchar('provider_account_id'),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type'),
  scope: varchar('scope'),
  id_token: text('id_token'),
  session_state: varchar('session_state'),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] })
}));

export const sessions = pgTable('session', {
  sessionToken: varchar('session_token').primaryKey(),
  userId: varchar('user_id').references(() => users.id),
  expires: timestamp('expires'),
});

export const verificationTokens = pgTable('verification_token', {
  identifier: varchar('identifier').notNull(),
  token: varchar('token').notNull(),
  expires: timestamp('expires'),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.identifier, table.token] })
}));

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: varchar('sku', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal('compare_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  images: jsonb('images').$type<string[]>().default([]),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  sizes: jsonb('sizes').$type<string[]>().default(['S', 'M', 'L', 'XL']),
  colors: jsonb('colors').$type<string[]>().default([]),
  stockQuantity: integer('stock_quantity').default(0),
  lowStockThreshold: integer('low_stock_threshold').default(10),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  parentId: integer('parent_id').references(() => categories.id),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).unique().notNull(),
  userId: varchar('user_id').references(() => users.id),
  customerName: varchar('customer_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 20 }),
  shippingAddress: jsonb('shipping_address'),
  billingAddress: jsonb('billing_address'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('pending'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentMethod: paymentMethodEnum('payment_method'),
  transactionId: varchar('transaction_id', { length: 255 }),
  notes: text('notes'),
  isPosOrder: boolean('is_pos_order').default(false),
  posSessionId: integer('pos_session_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  size: varchar('size', { length: 50 }),
  color: varchar('color', { length: 50 }),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cart
export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 255 }),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  size: varchar('size', { length: 50 }),
  color: varchar('color', { length: 50 }),
  addedAt: timestamp('added_at').defaultNow(),
});

// POS Sessions
export const posSessions = pgTable('pos_sessions', {
  id: serial('id').primaryKey(),
  sessionCode: varchar('session_code', { length: 50 }).unique().notNull(),
  adminId: varchar('admin_id').references(() => adminUsers.id).notNull(),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  startingCash: decimal('starting_cash', { precision: 10, scale: 2 }).default('0'),
  totalSales: decimal('total_sales', { precision: 10, scale: 2 }).default('0'),
  totalTransactions: integer('total_transactions').default(0),
  cashInHand: decimal('cash_in_hand', { precision: 10, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type CartItem = typeof cart.$inferSelect;

