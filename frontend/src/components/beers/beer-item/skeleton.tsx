import { Skeleton } from '@/components/ui/skeleton';

export const BeerItemSkeleton = () => {
  return (
    <div className="flex justify-between gap-2 rounded-xl border bg-white p-4 shadow-md">
      <Skeleton className="h-28 w-28 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex w-full justify-end gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};
