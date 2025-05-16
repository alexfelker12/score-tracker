import { Command, CommandInput, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"


export const TrackerCardsLoading = ({ length = 2 }: { length?: number }) => {
  return (
    Array.from({ length }).map((_, idx) => (
      <Skeleton key={`tracker-${idx}`} className="rounded-xl h-[90px]"></Skeleton>
    ))
  );
}

export const CommandWrapperLoading = () => {
  return (
    <div>
      {/* <Skeleton className="w-full h-9" /> */}
      <Command className="shadow-md border w-full">
        <CommandInput placeholder="Loading trackers..." disabled />
        <CommandList className="[&>div]:gap-1 [&>div]:grid md:[&>div]:grid-cols-2 p-1">
          <TrackerCardsLoading />
        </CommandList>
      </Command>
    </div>
  );
}
