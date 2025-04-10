'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { HangoutsList } from '@/components/hangouts/hangouts-list';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return redirect('/auth/signin');
  }

  return (
    <div>
      <HangoutsList />
    </div>
  );
}
