import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="space-y-6 p-4 w-full">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      <div className="space-y-3">
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 w-full col-span-2 rounded-lg" />
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </main>
  );
}
