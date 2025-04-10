import { useAuth } from '@/context/AuthContext';
import { HangoutForm } from './hangout-form';

export function HangoutsList() {
  const { user } = useAuth();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-bold">Juntadas para beber</h2>
        {!!user?.uid && <HangoutForm creatorId={user?.uid} />}
      </div>
    </div>
  );
}
