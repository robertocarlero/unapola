'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { signIn } from '@/api/auth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields = useMemo(
    (): {
      name: keyof FormData;
      label: string;
      autoComplete?: string;
      type?: string;
    }[] => [
      {
        name: 'email',
        label: 'Email Address',
        autoComplete: 'email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        autoComplete: 'current-password',
      },
    ],
    []
  );

  const validate = (data: FormData) => {
    const errors: Partial<Record<keyof FormData, string>> = fields.reduce(
      (acc, field) => {
        if (!data[field.name]) {
          acc[field.name] = `${field.label} is required`;
        }
        return acc;
      },
      {} as Partial<Record<keyof FormData, string>>
    );
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const errors = validate(formData);
      setErrors(errors);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation errors');
      }
      await signIn(formData);
      toast.success('Signed in successfully');
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
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 rounded-lg sm:bg-white sm:p-4 sm:shadow-sm">
            {fields.map(({ name, label, ...rest }) => (
              <fieldset key={name}>
                <label htmlFor={name}>{label}</label>
                <Input
                  id={name}
                  name={name}
                  required
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Type your ${label}`}
                  aria-invalid={!!errors[name]}
                  {...rest}
                />
                {errors[name] && (
                  <p className="ml-2 text-xs text-red-500">{errors[name]}</p>
                )}
              </fieldset>
            ))}
          </div>

          <div className="w-full">
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </div>

          <p className="text-center text-sm font-medium">
            <Link
              href="/auth/recovery"
              className="text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Link>
          </p>

          <p className="text-center text-sm font-medium">
            Don&apos;t have an account?
            <Link
              href="/auth/signup"
              className="text-primary hover:text-primary/80 ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
