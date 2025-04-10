'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return redirect('/auth/signin');
  }

  return <div>Home</div>;
}
