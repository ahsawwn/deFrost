# Admin Authentication System

This document explains the separate admin authentication system for DeFrost.

## Overview

The admin authentication system is **completely separate** from shop user authentication:

- **Shop Users**: Login at `/login` → Access `/dashboard`
- **Admin/Manager/Cashier**: Login at `/admin/login` → Access `/admin/*`

## Roles

The system supports three staff roles:

1. **Admin** - Full access to all admin features
2. **Manager** - Access to most admin features (can be restricted)
3. **Cashier** - Access to POS and limited features

## Database Schema

The `user_role` enum supports:
- `customer` - Regular shop users
- `admin` - Full admin access
- `manager` - Manager access
- `cashier` - Cashier/POS access
- `staff` - General staff (for future use)

## Authentication Flow

### Admin Login (`/admin/login`)

1. User enters email and password
2. System checks if user has `admin`, `manager`, or `cashier` role
3. If valid, creates session and redirects to `/admin/dashboard`
4. Admin users are **auto-verified** (no email verification needed)

### Shop User Login (`/login`)

1. User enters email and password
2. System checks if user has `customer` role
3. Email verification is required for customers
4. If valid, creates session and redirects to `/dashboard`

## Seeding Staff Users

### Method 1: Seed Single User

```bash
# Default admin user
npm run seed:admin

# Custom user
ADMIN_EMAIL=manager@defrost.com ADMIN_PASSWORD=manager123 ADMIN_NAME="Manager" ADMIN_ROLE=manager npm run seed:admin
```

### Method 2: Seed All Staff (Recommended)

Creates admin, manager, and cashier users:

```bash
npm run seed:staff
```

This creates:
- **Admin**: `admin@defrost.com` / `admin123`
- **Manager**: `manager@defrost.com` / `manager123`
- **Cashier**: `cashier@defrost.com` / `cashier123`

### Method 3: API Route

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@defrost.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

## Proxy System

The `lib/proxy.ts` file provides utilities for protecting admin API routes:

```typescript
import { adminProxy } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return adminProxy(request, async (req, session) => {
    // Your protected admin code here
    // session.user.role will be 'admin', 'manager', or 'cashier'
    return NextResponse.json({ data: 'protected' });
  });
}
```

### Helper Functions

- `hasRole(userRole, allowedRoles)` - Check if user has specific role
- `isAdmin(userRole)` - Check if user is admin
- `isManagerOrAdmin(userRole)` - Check if user is manager or admin
- `canAccessAdmin(userRole)` - Check if user can access admin panel

## Middleware Protection

The `middleware.ts` file protects routes:

- `/admin/*` routes require admin authentication
- `/dashboard/*` routes require customer authentication
- Unauthenticated users are redirected to appropriate login pages

## Security Features

1. **Separate Login Pages**: Admin and shop users use different login pages
2. **Role-Based Access**: Each role has different permissions
3. **Auto-Verification**: Admin users don't need email verification
4. **Password Hashing**: All passwords are hashed with bcrypt (10 rounds)
5. **Session Management**: JWT-based sessions with role information

## Default Credentials

After running `npm run seed:staff`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@defrost.com | admin123 |
| Manager | manager@defrost.com | manager123 |
| Cashier | cashier@defrost.com | cashier123 |

⚠️ **Important**: Change these passwords in production!

## Role Permissions (Future Implementation)

You can extend the proxy system to implement role-based permissions:

```typescript
// Only admin can access
if (!isAdmin(session.user.role)) {
  return NextResponse.json({ error: 'Admin only' }, { status: 403 });
}

// Admin or manager can access
if (!isManagerOrAdmin(session.user.role)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 });
}
```

## Troubleshooting

### Can't Login to Admin Panel

1. Check if user exists: `npm run seed:admin`
2. Verify role is `admin`, `manager`, or `cashier`
3. Check database connection
4. Verify `NEXTAUTH_SECRET` is set in `.env.local`

### Session Not Working

1. Clear browser cookies
2. Check `NEXTAUTH_URL` in `.env.local`
3. Verify middleware is working correctly

### Role Not Recognized

1. Update database schema: `npm run db:push`
2. Verify user role in database
3. Check if role enum includes the role you're using

