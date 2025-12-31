import { db } from '@/lib/db';
import { verificationTokens } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store verification code in database
export async function storeVerificationCode(email: string, code: string) {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10); // Code expires in 10 minutes

  // Delete any existing codes for this email
  await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

  // Insert new code
  await db.insert(verificationTokens).values({
    identifier: email,
    token: code,
    expires: expires,
  });
}

// Verify the code
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const [token] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, code),
        gt(verificationTokens.expires, new Date())
      )
    )
    .limit(1);

  if (!token) {
    return false;
  }

  // Delete the used code
  await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

  return true;
}

// Send verification email (placeholder - replace with actual email service)
export async function sendVerificationEmail(email: string, code: string) {
  // TODO: Replace with actual email service (Resend, SendGrid, Nodemailer, etc.)
  console.log('📧 Verification Code:', code);
  console.log('📧 Email:', email);
  console.log('📧 In production, this would send an email with the verification code');
  
  // Example with a real email service (uncomment and configure):
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'DeFrost <noreply@defrost.com>',
    to: email,
    subject: 'Verify your DeFrost account',
    html: `
      <h1>Welcome to DeFrost!</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  });
  */
}

