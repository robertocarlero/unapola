import { Skeleton } from '@/components/ui/skeleton';

export const BeerItemSkeleton = () => {
  return (
    <div className="flex gap-2 rounded-md border bg-white p-2 shadow-md">
      <div className="flex items-center gap-2">
        <Skeleton className="h-24 w-24 rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  );
};
