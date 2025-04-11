import { useCallback } from 'react';

import { getRounds } from '@/lib/api/hangouts';
import { useSnapshot } from '@/lib/hooks/useSnapshot';

import { OrderItem, OrderItemSkeleton } from './order-item';

type OrderListProps = {
  hangoutId: string;
};

export const OrderList = ({ hangoutId }: OrderListProps) => {
  const getData = useCallback(() => getRounds({ hangoutId }), [hangoutId]);

  const { data: rounds, loading } = useSnapshot({
    fn: getData,
    active: !!hangoutId,
  });

  return (
    <div className="flex flex-col gap-4">
      {loading
        ? [1, 2, 3].map((item) => <OrderItemSkeleton key={item} />)
        : rounds?.map((round) => <OrderItem key={round.id} data={round} />)}
    </div>
  );
};
