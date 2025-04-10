'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { recoveryPassword } from '@/api/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Recovery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');

  const validate = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const validationError = validate(email);
      setError(validationError);
      if (validationError) {
        throw new Error(validationError);
      }
      await recoveryPassword({ email });
      toast.success('Recovery email sent successfully');
    } catch (err) {
      toast.error((err as Error).message);
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recover Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 rounded-lg sm:bg-white sm:p-4 sm:shadow-sm">
            <fieldset>
              <label htmlFor="email">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Type your email"
                aria-invalid={!!error}
                autoComplete="email"
              />
              {error && <p className="ml-2 text-xs text-red-500">{error}</p>}
            </fieldset>
          </div>

          <div className="w-full">
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? 'Loading...' : 'Send Recovery Link'}
            </Button>
          </div>

          <p className="text-center text-sm font-medium">
            Remember your password?
            <Link
              href="/auth/signin"
              className="text-primary hover:text-primary/80 ml-1"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
