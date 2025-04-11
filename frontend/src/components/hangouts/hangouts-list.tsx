import { useCallback, useEffect } from 'react';

import { getHangouts } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';

import { useAuth } from '@/context/AuthContext';
import { useHangoutContext } from '@/context/HangoutContext';

import { HangoutCard } from './hangout-card';
import { HangoutForm } from './hangout-form';
import { HangoutSkeleton } from './hangout-skeleton';

export function HangoutsList() {
  const { user } = useAuth();
  const { focusedHangout, setFocusedHangout } = useHangoutContext();

  const fn = useCallback(
    () => getHangouts({ participantId: user?.uid ?? '' }),
    [user?.uid]
  );

  const { data: hangouts, loading: isLoading } = useSnapshot({
    fn,
    active: !!user?.uid,
  });

  useEffect(() => {
    if (focusedHangout) return;
    if (hangouts?.length) {
      setFocusedHangout(hangouts[0]?.id);
    }
  }, [hangouts, focusedHangout, setFocusedHangout]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full justify-between px-4">
        <h2 className="text-xl font-bold">Juntadas para beber</h2>
        {!!user?.uid && <HangoutForm creatorId={user?.uid} />}
      </div>
      {isLoading ? (
        Array(3).map((_, index) => <HangoutSkeleton key={index} />)
      ) : (
        <div className="flex w-full gap-4 overflow-x-auto p-4">
          {hangouts?.map((hangout) => (
            <HangoutCard
              key={hangout.id}
              data={hangout}
              focused={focusedHangout === hangout?.id}
              onClick={() => setFocusedHangout(hangout?.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
