import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  const placeholders = Array.from({ length: 6 });

  return (
    <main className="p-4 flex flex-col items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-7xl">
        {placeholders.map((_, i) => (
          <Skeleton key={i} className="bg-muted/70 rounded-lg p-4 h-72 relative">
            <Skeleton className="mb-3 w-32 h-6" />
            <Skeleton className="h-5 mb-2 w-[96%]" />
            <Skeleton className="h-5 mb-2 w-[98%]" />
            <Skeleton className="h-5 mb-2 w-[94%]" />
            <Skeleton className="h-5 w-[90%]" />
            <Skeleton className="absolute right-4 h-4 w-28 bottom-4" />
          </Skeleton>
        ))}
      </div>
    </main>
  );
}
