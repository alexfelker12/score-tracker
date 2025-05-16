"use client"

// react/next
import Link from "next/link";
import { use } from "react";

// packages
import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";

// server
import { FindArchivedTrackersForCreatorReturn, FindTrackersAsParticipantReturn, FindTrackersByCreatorReturn, getAllTrackersAsParticipant } from "@/server/actions/tracker/actions";

// lib

// icons
import { ArrowRightIcon } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// local
import { auth } from "@/lib/auth";
import { TrackerType } from "@prisma/client";
import { TrackerCardsLoading } from "./tracker-loading";


export type TrackersProps = {
  session: typeof auth.$Infer.Session
  trackerType: TrackerType
  queryKey?: string[]

  dataPromise: ReturnType<typeof getAllTrackersAsParticipant>
}
export const TrackerListing = ({ session, trackerType, queryKey, dataPromise }: TrackersProps) => {
  // GET data with suspense
  const { data: { data, error }, isFetching } = useSuspenseQuery({
    initialData: use(dataPromise),
    queryKey: queryKey || ["trackers", trackerType, session.user.id, "trackers"],
    queryFn: () => {
      console.log("running queryFn")
      return getAllTrackersAsParticipant(trackerType, session.user.id)
    },
    refetchOnMount: false, refetchOnReconnect: false
  })

  // get status of create mutation to display loading skeleton for new tracker
  //? replace with https://tanstack.com/query/latest/docs/framework/react/reference/useIsMutating
  const isCreatePending = useMutationState({
    filters: { mutationKey: ['tracker-create', trackerType], status: 'pending' },
    select: (mutation) => mutation.state.status === 'pending',
  })[0];

  // error-case
  if (error) return <div> could not load trackers </div>;

  // listing
  return (
    <Command className="shadow-md border w-full">
      <CommandInput placeholder="Search trackers..." />
      <CommandList className="[&>div]:gap-1 [&>div]:grid md:[&>div]:grid-cols-2 p-1 max-h-full">
        {/* optimistic load */}
        {(isCreatePending && isFetching) && <TrackerCardsLoading length={1} />}

        {/* tracker cards */}
        {data.map((tracker) => (
          <CommandItem
            asChild
            key={tracker.id}
            value={tracker.displayName}
          >
            <TrackerCard
              userId={session.user.id}
              tracker={tracker}
            />
          </CommandItem>
        ))}

        {/* {data.data.length === 0 && } */}
        <CommandEmpty className="flex justify-center items-center md:col-span-2 h-10">No trackers found</CommandEmpty>
      </CommandList>
    </Command>
  )
}

export type TrackerCardParams = {
  userId: string
  tracker: FindTrackersByCreatorReturn[0]
  | FindTrackersAsParticipantReturn[0]
  | FindArchivedTrackersForCreatorReturn[0]
}
export const TrackerCard = ({
  tracker,
  userId
}: TrackerCardParams) => {

  // const timeSinceCreation = timeElapsed(tracker.createdAt)

  return (
    <Card className="flex-row justify-between gap-2 p-3 w-full h-full transition-all">
      <CardHeader className="flex-col justify-between items-start p-0">
        {/* tracker name */}
        <CardTitle className="text-lg leading-none">{tracker.displayName}</CardTitle>

        <CardDescription className="flex flex-col">
          {/* amount players participating */}
          <span>{tracker._count.players} player{tracker._count.players !== 1 && "s"}</span>

          <div className="flex gap-2">
            {/* creator */}
            <span>created by {tracker.creatorId === userId
              ? "you"
              : tracker.creator
                ? (tracker.creator.displayUsername || tracker.creator.name)
                : <span className="italic">deleted user</span>
            }</span>

            {/* <div role="presentation" aria-hidden="true">-</div> */}

            {/* time since creation */}
            {/* <span>{timeSinceCreation}</span> */}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between items-center p-0">
        {/* link to tracker */}
        <Button
          variant="outline"
          size="icon"
          asChild
        >
          <Link href={`/trackers/schwimmen/${tracker.id}-${encodeURIComponent(tracker.displayName)}`}>
            <ArrowRightIcon />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// export const TimeElapsed = ({ createdAt }: { createdAt: Date }) => {
//   const [elapsed, setElapsed] = React.useState<string>("")
//   const [isReady, setIsReady] = React.useState(false)

//   React.useEffect(() => {
//     //* very simple time update every minute
//     const updateElapsed = () => {
//       setElapsed(timeElapsed(createdAt))
//       setIsReady(true)
//     };

//     updateElapsed()

//     // maybe add precise calculation to update time elapsed on the minute
//     //? idea: modulo operation to find amount of minutes (without seconds) passed to get seconds to next minute and set interval from there one
//     //! on hold

//     const minuteInterval = setInterval(updateElapsed, 60000)//* 60_000 = 1 minute

//     return () => {
//       clearInterval(minuteInterval)
//     }
//   }, [createdAt])

//   if (!isReady) return <Skeleton className="w-24 h-5" />

//   return <>{elapsed}</>;
// };
