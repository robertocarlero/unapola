import { useCallback } from 'react';

import { getHangouts } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';

import { useAuth } from '@/context/AuthContext';

import { HangoutCard } from './hangout-card';
import { HangoutForm } from './hangout-form';
import { HangoutSkeleton } from './hangout-skeleton';

export function HangoutsList() {
  const { user } = useAuth();

  const fn = useCallback(
    () => getHangouts({ participantId: user?.uid ?? '' }),
    [user?.uid]
  );

  const { data: hangouts, loading: isLoading } = useSnapshot({
    fn,
    active: !!user?.uid,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-bold">Juntadas para beber</h2>
        {!!user?.uid && <HangoutForm creatorId={user?.uid} />}
      </div>
      {isLoading ? (
        Array(3).map((_, index) => <HangoutSkeleton key={index} />)
      ) : (
        <div className="flex w-full gap-4 overflow-x-auto">
          {hangouts?.map((hangout) => (
            <HangoutCard key={hangout.id} data={hangout} />
          ))}
        </div>
      )}
    </div>
  );
}
