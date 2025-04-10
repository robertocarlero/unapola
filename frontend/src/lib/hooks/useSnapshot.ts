import { useEffect, useMemo, useState } from 'react';

import { Snapshot } from '@/lib/types/db';

type UseSnapshotOptions<T> = {
  initialData?: T | null;
  fn: () => Snapshot<T>;
  active?: boolean;
};

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
