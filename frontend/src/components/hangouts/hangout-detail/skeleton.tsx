import { Skeleton } from '@/components/ui/skeleton';

export function HangoutDetailSkeleton() {
  return (
    <div className="h-full w-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-16 w-16 rounded-full shadow-md" />
          <div className="flex flex-col">
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
