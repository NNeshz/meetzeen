import { Skeleton } from "@meetzeen/ui/src/components/skeleton";

export function CompanyLoading() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4 w-full">
          <div>
            <Skeleton className="h-4 w-56 animate-pulse" />
            <Skeleton className="h-4 w-56 animate-pulse" />
          </div>
          <Skeleton className="w-full max-w-md h-10 animate-pulse" />
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <Skeleton className="h-4 w-56 animate-pulse" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
