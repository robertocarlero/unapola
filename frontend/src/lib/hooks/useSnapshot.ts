import { useEffect, useMemo, useState } from 'react';

import { Snapshot } from '@/lib/types/db';

type UseSnapshotOptions<T> = {
  initialData?: T | null;
  fn: () => Snapshot<T>;
  active?: boolean;
};

/**
 * Hook to get a snapshot of a Firestore document or collection.
 * @param options - The options for the useSnapshot hook.
 * @param options.initialData - The initial data to set when the hook is first mounted.
 * @param options.fn - The function to call to get the snapshot.
 * @param options.active - Whether the hook is active.
 *
 * @example
 * const { data, loading } = useSnapshot({
 *   fn: () => getDocument({ path: 'users', id: '123' }),
 *   active: true,
 * });
 *
 * Response:
 * {
 *   data: null,
 *   loading: true,
 * }
 */
export const useSnapshot = <T>({
  initialData,
  fn,
  active = true,
}: UseSnapshotOptions<T>) => {
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!active) return;

    const unsubscribe = fn?.()?.onSnapshot?.((res: unknown) => {
      setData(res as T | null);
      setLoading(false);
    });

    return () => {
      unsubscribe?.();
    };
  }, [fn, active]);

  const body = useMemo(() => ({ data, loading }), [data, loading]);

  return body;
};
