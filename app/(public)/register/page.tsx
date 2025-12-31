'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Mail, Lock, User, Phone, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

type Step = 'email' | 'verify' | 'complete';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-and-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setStep('complete');
      
      // Auto sign in after registration
      setTimeout(async () => {
        // Sign in the user automatically
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        
        if (signInResult?.ok) {
          router.push('/');
          router.refresh();
        } else {
          // If auto sign in fails, redirect to login
          router.push('/login?registered=true');
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/signin/google';
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Created!</h1>
          <p className="text-gray-600 mb-6">Your account has been successfully created. Redirecting to login...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join DeFrost and start shopping</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-all h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Verification Code
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <p className="text-center text-sm text-gray-600 mb-4">
                Already have an account?
              </p>
              <Link href="/login">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep('email')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            {/* Verification Info */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-900">
                Verification code sent to <strong>{formData.email}</strong>
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-600 mt-2">
                  💡 Check console for code (dev mode only)
                </p>
              )}
            </div>

            {/* Verification Code Input */}
            <div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                maxLength={6}
                required
              />
            </div>

            {/* Name Input */}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="tel"
                  placeholder="Phone (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-all h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
