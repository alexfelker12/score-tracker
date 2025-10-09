import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4 border rounded-md w-full">
      <Skeleton className="rounded-full size-24 self-center" />
      <Separator className="w-full" />
      <div className="space-y-3">
        <Skeleton className="mt-1 w-24 h-5" />
        <Skeleton className="w-44 h-3.5" />
      </div>
    </div>
  );
}
