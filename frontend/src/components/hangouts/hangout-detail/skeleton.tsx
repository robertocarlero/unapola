import { OrderItemSkeleton } from '@/components/orders/order-item';
import { Skeleton } from '@/components/ui/skeleton';

export function HangoutDetailSkeleton() {
  return (
    <section className="flex h-full w-full flex-col gap-4">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-16 w-16 rounded-full shadow-md" />
          <div className="flex flex-col">
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-1 h-2 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-26" />
        </div>
      </div>

      <div className="m-auto flex w-full max-w-3xl flex-col justify-center">
        <div className="m-auto mb-12 flex gap-4">
          <Skeleton className="h-10 w-96" />
        </div>

        <div className="flex w-full flex-col gap-4">
          <Skeleton className="h-16 w-full rounded-md" />
          {[1, 2, 3].map((item) => (
            <OrderItemSkeleton key={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
