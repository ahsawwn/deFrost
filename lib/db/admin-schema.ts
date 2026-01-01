import { pgTable, varchar, integer, boolean, jsonb, timestamp, text, pgEnum, primaryKey, serial, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Admin-specific enums
export const adminRoleEnum = pgEnum('admin_role', ['admin', 'manager', 'cashier']);

// Admin Users - Separate from shop users
export const adminUsers = pgTable('admin_user', {
  id: varchar('id').primaryKey(),
  name: varchar('name'),
  email: varchar('email').unique().notNull(),
  emailVerified: timestamp('email_verified'),
  password: varchar('password'),
  role: adminRoleEnum('role').default('admin'),
  image: varchar('image'),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admin NextAuth additional tables
export const adminAccounts = pgTable('admin_account', {
  userId: varchar('user_id').references(() => adminUsers.id),
  type: varchar('type'),
  provider: varchar('provider').notNull(),
  providerAccountId: varchar('provider_account_id').notNull(),
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

export const adminSessions = pgTable('admin_session', {
  sessionToken: varchar('session_token').primaryKey(),
  userId: varchar('user_id').references(() => adminUsers.id),
  expires: timestamp('expires'),
});

export const adminVerificationTokens = pgTable('admin_verification_token', {
  identifier: varchar('identifier').notNull(),
  token: varchar('token').notNull(),
  expires: timestamp('expires'),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.identifier, table.token] })
}));

// Export types
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminAccount = typeof adminAccounts.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).unique().notNull(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }),
  date: timestamp('date').defaultNow(),
  recordedBy: varchar('recorded_by').references(() => adminUsers.id),
});


