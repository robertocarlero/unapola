'use client';
import { redirect } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) {
    return redirect('/');
  }

  return <>{children}</>;
}
