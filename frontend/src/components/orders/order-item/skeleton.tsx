import { Skeleton } from '@/components/ui/skeleton';

export const OrderItemSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white p-4 shadow-md">
      <div className="flex items-center gap-2 pl-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="relative ml-[-16px]">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="absolute top-0 right-0 h-4 w-4 rounded-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end justify-end">
        <Skeleton className="mb-2 h-6 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};
