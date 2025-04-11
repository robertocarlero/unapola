import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/helpers/dates';
import { Round } from '@/lib/types/beers';
import { useMemo } from 'react';

export * from './skeleton';

type OrderItemProps = {
  data: Round | null;
};

export const OrderItem = ({ data }: OrderItemProps) => {
  const { items, createdAt } = data || {};

  const total = useMemo(
    () =>
      items?.reduce((acc, item) => {
        const { price, quantity, discount } = item;

        const discountValue = price * ((discount || 0) / 100);
        const finalPrice = price - discountValue;

        return acc + finalPrice * quantity;
      }, 0),
    [items]
  );

  // DD, dd/mm/yyyy hh:mm
  const formattedDate = useMemo(
    () =>
      formatDate(createdAt?.toDate?.(), {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    [createdAt]
  );

  return (
    <div className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white p-4 shadow-md">
      <div className="flex items-center gap-2 pl-4">
        {items?.map((item) => (
          <div key={item.id} className="relative ml-[-14px] sm:ml-[-16px]">
            <Avatar className="relative h-10 w-10 shadow-md sm:h-16 sm:w-16">
              <AvatarImage src={item.image?.url_thumb || item.image?.url} />
              <AvatarFallback>{item.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Badge
              variant="destructive"
              className="absolute top-0 right-0 rounded-full"
            >
              {item.quantity}
            </Badge>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end justify-end">
        <p className="font-medium">Total: {total}$</p>
        <p className="text-muted-foreground text-xs">{formattedDate}</p>
      </div>
    </div>
  );
};
