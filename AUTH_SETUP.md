# Authentication Setup Guide

## ✅ Features Implemented

1. **Email Signup with Verification Code**
   - Two-step registration process
   - Email verification with 6-digit code
   - Code expires in 10 minutes
   - Secure password hashing with bcrypt

2. **Google OAuth Authentication**
   - One-click sign in with Google
   - Automatic account creation for new users
   - Seamless integration with NextAuth

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```env
# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Required for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=your_neon_connection_string_here
```

## 📝 Setting Up Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret**
8. Add them to your `.env.local` file

### Step 2: Enable Google+ API (if needed)

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "People API"
3. Enable it for your project

## 📧 Email Verification Setup

Currently, verification codes are logged to the console in development mode. To send actual emails:

### Option 1: Using Resend (Recommended)

1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Install Resend:
   ```bash
   npm install resend
   ```
4. Update `lib/email-verification.ts`:
   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   await resend.emails.send({
     from: 'DeFrost <noreply@yourdomain.com>',
     to: email,
     subject: 'Verify your DeFrost account',
     html: `
       <h1>Welcome to DeFrost!</h1>
       <p>Your verification code is: <strong>${code}</strong></p>
       <p>This code will expire in 10 minutes.</p>
     `,
   });
   ```
5. Add to `.env.local`:
   ```env
   RESEND_API_KEY=your_resend_api_key
   ```

### Option 2: Using Nodemailer

1. Install Nodemailer:
   ```bash
   npm install nodemailer
   npm install -D @types/nodemailer
   ```
2. Configure SMTP settings in `lib/email-verification.ts`

### Option 3: Using SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Get your API key
3. Install SendGrid:
   ```bash
   npm install @sendgrid/mail
   ```
4. Update `lib/email-verification.ts` with SendGrid configuration

## 🔐 Registration Flow

### Email Signup Flow:
1. User enters email address
2. System sends 6-digit verification code
3. User enters verification code + completes registration form
4. Account is created with verified email
5. User is redirected to login

### Google OAuth Flow:
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. After approval, account is automatically created/authenticated
4. User is redirected to dashboard

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Email verification required before login
- ✅ Verification codes expire after 10 minutes
- ✅ One-time use verification codes
- ✅ Secure session management with JWT
- ✅ CSRF protection via NextAuth

## 🧪 Testing

### Development Mode
- Verification codes are logged to console
- Check terminal/console for the 6-digit code
- Google OAuth works with test credentials

### Production Mode
- Verification codes sent via email
- Google OAuth requires production credentials
- Ensure all environment variables are set

## 📱 User Experience

### Registration Page (`/register`)
- Clean, futuristic design matching brand
- Two-step process (email → verification)
- Google OAuth option available
- Clear error messages
- Loading states

### Login Page (`/login`)
- Email/password authentication
- Google OAuth option
- "Forgot password" link (to be implemented)
- Success message after registration

## 🚀 Next Steps

1. **Email Service Integration**
   - Choose and configure email service (Resend recommended)
   - Update `lib/email-verification.ts`

2. **Password Reset**
   - Implement forgot password flow
   - Add password reset API routes

3. **Email Resend**
   - Add "Resend code" functionality
   - Rate limiting for code requests

4. **Two-Factor Authentication** (Optional)
   - Add 2FA for enhanced security
   - Use authenticator apps

5. **Social Logins** (Optional)
   - Add Facebook, GitHub, etc.
   - Follow same pattern as Google OAuth

