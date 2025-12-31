import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { adminUsers, adminAccounts, adminSessions, adminVerificationTokens } from '@/lib/db/admin-schema';
import { eq, inArray } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * Separate auth configuration for admin/manager/cashier users
 * This is completely separate from shop user authentication
 */
export const { handlers: adminHandlers, auth: adminAuth, signIn: adminSignIn, signOut: adminSignOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: adminUsers as any,
    accountsTable: adminAccounts as any,
    sessionsTable: adminSessions as any,
    verificationTokensTable: adminVerificationTokens as any,
  }),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    Credentials({
      name: 'admin-credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Admin authorize: Missing email or password');
          throw new Error('Email and password are required');
        }

        console.log('Admin authorize: Checking user:', credentials.email);

        // Only allow admin, manager, or cashier roles
        let user;
        try {
          const [userResult] = await db
            .select()
            .from(adminUsers)
            .where(
              eq(adminUsers.email, credentials.email as string)
            )
            .limit(1);
          user = userResult;
        } catch (dbError: any) {
          throw dbError;
        }

        if (!user) {
          console.error('Admin authorize: User not found:', credentials.email);
          throw new Error('Invalid email or password');
        }

        if (!user.password) {
          console.error('Admin authorize: User has no password:', credentials.email);
          throw new Error('Invalid email or password');
        }

        // Check if user has admin role (admin, manager, or cashier)
        const adminRoles = ['admin', 'manager', 'cashier'];
        if (!adminRoles.includes(user.role || '')) {
          console.error('Admin authorize: Invalid role:', user.role);
          throw new Error('Access denied. Admin credentials required.');
        }

        console.log('Admin authorize: Comparing password for:', credentials.email);
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          console.error('Admin authorize: Password mismatch for:', credentials.email);
          throw new Error('Invalid email or password');
        }

        console.log('Admin authorize: Success for:', credentials.email);

        // Admin users don't need email verification
        // But we can check if emailVerified exists
        if (!user.emailVerified) {
          // Auto-verify admin users on first login
          await db
            .update(adminUsers)
            .set({ emailVerified: new Date(), lastLogin: new Date() })
            .where(eq(adminUsers.id, user.id));
        } else {
          // Update last login
          await db
            .update(adminUsers)
            .set({ lastLogin: new Date() })
            .where(eq(adminUsers.id, user.id));
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-admin-auth.session-token'
        : 'admin-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

