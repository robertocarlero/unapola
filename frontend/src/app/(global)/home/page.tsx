'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { HangoutsList } from '@/components/hangouts/hangouts-list';
import { HangoutDetail } from '@/components/hangouts/hangout-detail';
export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return redirect('/auth/signin');
  }

  return (
    <div className="mb-12 flex h-full w-full flex-col gap-4">
      <HangoutsList />
      <HangoutDetail />
    </div>
  );
}
