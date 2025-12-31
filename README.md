# DeFrost - E-Commerce Platform

A modern, futuristic e-commerce platform built with Next.js, featuring a complete admin dashboard, POS system, and customer-facing store.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products by category with modern UI
- **Shopping Cart**: Add items to cart and manage quantities
- **Checkout**: Complete checkout process
- **User Dashboard**: View orders, manage profile, and redeem coupons
- **Authentication**: Email verification and Google OAuth login

### Admin Features
- **Admin Dashboard**: Analytics, statistics, and overview
- **Product Management**: Create, update, and manage products
- **Inventory Management**: Track stock levels and low stock alerts
- **Order Management**: View and process customer orders
- **POS System**: Point of sale with barcode scanning and receipt generation
- **Analytics**: Sales charts and business insights

### Authentication
- **Dual Authentication System**: Separate login for customers and admin staff
- **Email Verification**: Two-step registration with verification codes
- **Google OAuth**: One-click sign-in with Google
- **Role-Based Access**: Admin, Manager, and Cashier roles

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth v5
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **UI Components**: Radix UI, Lucide Icons

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database (Neon recommended)
- Google OAuth credentials (for Google sign-in)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahsawwn/deFrost.git
   cd defrost
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_neon_connection_string_here
   
   # NextAuth
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   Generate a secret for NextAuth:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Seed admin users** (Optional)
   ```bash
   npm run seed:staff
   ```
   
   This creates:
   - Admin: `admin@defrost.com` / `admin123`
   - Manager: `manager@defrost.com` / `manager123`
   - Cashier: `cashier@defrost.com` / `cashier123`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Main site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login
   - POS system: http://localhost:3000/admin/pos

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:generate` - Generate migration files
- `npm run seed:admin` - Seed a single admin user
- `npm run seed:staff` - Seed all staff users (admin, manager, cashier)
- `npm run seed:admin-users` - Seed admin users via API
- `npm run seed:admin-staff` - Seed admin staff via API
- `npm run check:admin-users` - Check existing admin users

## 📁 Project Structure

```
defrost/
├── app/
│   ├── (public)/          # Public routes (shop, cart, checkout)
│   ├── (protected)/       # Protected user routes (dashboard, orders)
│   ├── admin/             # Admin routes (dashboard, POS, products)
│   └── api/               # API routes (auth, products, cart)
├── components/
│   ├── admin/             # Admin-specific components
│   ├── dashboard/         # Dashboard components
│   ├── landing/           # Landing page components
│   ├── shared/            # Shared components (Navbar, Footer)
│   └── ui/                # UI components (Button, Card, etc.)
├── lib/
│   ├── db/                # Database schema and connection
│   ├── auth.ts            # Customer authentication
│   ├── auth-admin.ts      # Admin authentication
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── scripts/               # Database seeding scripts
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

## 🔐 Authentication

### Customer Authentication
- Login at `/login`
- Registration at `/register` with email verification
- Google OAuth support
- Email verification required for new accounts

### Admin Authentication
- Separate login at `/admin/login`
- Role-based access (Admin, Manager, Cashier)
- Auto-verified (no email verification needed)
- Protected routes with middleware

For detailed authentication setup, see [AUTH_SETUP.md](./AUTH_SETUP.md) and [README-ADMIN-AUTH.md](./README-ADMIN-AUTH.md).

## 🎨 Design Features

- Futuristic dark theme
- Glass morphism effects
- Neon glow animations
- Gradient text effects
- Smooth transitions
- Mobile-responsive design

## 📚 Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Authentication setup guide
- [README-ADMIN-AUTH.md](./README-ADMIN-AUTH.md) - Admin authentication system
- [README-SEED.md](./README-SEED.md) - Database seeding guide
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Setup completion checklist

## 🚧 Development Status

This project is in active development. Current features:
- ✅ User authentication (email + Google OAuth)
- ✅ Admin authentication system
- ✅ Product browsing and cart
- ✅ Admin dashboard and POS system
- ✅ Database schema and migrations
- 🚧 Payment integration (in progress)
- 🚧 Order processing (in progress)
- 🚧 Email notifications (in progress)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary.

## 👤 Author

DeFrost Team

---

**Note**: Make sure to change default admin passwords in production!
