'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use our custom signin API route
      const response = await fetch('/api/admin/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password. Make sure you are using admin credentials.' 
          : result.error);
      } else if (result.ok) {
        // Success - wait a moment for session cookie to be set, then redirect
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 200);
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to access the admin panel</p>
          <p className="text-sm text-gray-500 mt-2">
            For admin, manager, or cashier access
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Email Input */}
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Admin Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-all h-12 text-base font-semibold"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In to Admin Panel
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
              <span className="px-4 bg-white text-gray-600">Separate from shop login</span>
            </div>
          </div>

          {/* Link to Shop */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Shop
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a separate login system for staff members only. 
            Shop customers should use the <Link href="/login" className="underline">regular login</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
