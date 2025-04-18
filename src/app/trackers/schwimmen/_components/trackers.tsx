"use client"

//* react/next
import Link from "next/link";
import React from "react";

//* packages
import { useMutationState, useQuery } from "@tanstack/react-query";

//* lib
import { timeElapsed } from "@/lib/utils";

//* hooks
import { useDeleteTracker, UseHandleDeleteFunc } from "@/hooks/use-delete-tracker";

//* icons
import { ArrowRightIcon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

import { FindArchivedTrackersForCreatorReturn, FindTrackersByCreatorReturn, FindTrackersForParticipantReturn } from "@/server/actions/tracker/actions";
import { queryFuncMap, TrackerListingParams } from "./tracker-listing";


export type TrackersProps = TrackerListingParams
export const Trackers = ({ trackerType, userId, queryFunc, queryFuncName }: TrackersProps) => {
  //* GET data by query function
  const { data, isFetching, isPending } = useQuery({
    queryKey: ["trackers", trackerType, userId, queryFuncMap[queryFuncName]],
    queryFn: () => queryFunc(trackerType, userId),
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  //* DELETE mutation: tracker
  const { deleteTracker, isDeletePending } = useDeleteTracker()

  //* get status of create mutation to display loading skeleton for new tracker
  const isCreatePending = useMutationState({
    filters: { mutationKey: ['tracker-create', trackerType], status: 'pending' },
    select: (mutation) => mutation.state.status === 'pending',
  })[0];

  //* error-case
  if (!data || data && data.error) return;

  //* loading
  if (isPending) return <TrackerCardsLoading />

  //* listing
  if (data && data.data) return (
    <Command className="shadow-md border w-full">
      <CommandInput placeholder="Search trackers..." />
      <CommandList className="[&>div]:gap-1 [&>div]:grid md:[&>div]:grid-cols-2 p-1">
        {/* optimistic load */}
        {(isCreatePending && isFetching) && <TrackerCardsLoading length={1} />}

        {/* tracker cards */}
        {data.data.map((tracker) => (
          <CommandItem
            asChild
            key={tracker.id}
            value={tracker.displayName}
          >
            <TrackerCard
              deleteTracker={deleteTracker}
              isPending={isDeletePending}
              userId={userId}
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
  deleteTracker: UseHandleDeleteFunc
  isPending: boolean
  userId: string
  tracker: FindTrackersByCreatorReturn[0]
  | FindTrackersForParticipantReturn[0]
  | FindArchivedTrackersForCreatorReturn[0]
}
export const TrackerCard = ({
  isPending,
  tracker,
  userId
}: TrackerCardParams) => {
  return (
    <Card className="flex-row justify-between gap-2 p-3 w-full h-full transition-all">
      <CardHeader className="flex-col justify-between items-start p-0">
        {/* tracker name */}
        <CardTitle className="text-lg leading-none">{tracker.displayName}</CardTitle>

        <CardDescription className="flex flex-col">
          {/* amount players participating */}
          {/* less than 2 players shouldn't be possible but in case user deletes all other players from existing tracker */}
          <span>{tracker._count.players} player{tracker._count.players > 1 && "s"}</span>

          <div className="flex gap-2">
            {/* creator */}
            <span>created by {tracker.creatorId === userId
              ? "you"
              : tracker.creator.displayUsername
            }</span>

            <div role="presentation" aria-hidden="true">-</div>

            {/* time since creation */}
            <TimeElapsed createdAt={tracker.createdAt} />
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between items-center p-0">
        {/* link to tracker */}
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
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


export type TrackerCardsLoadingParams = {
  length?: number
}
export const TrackerCardsLoading = ({ length = 2 }: TrackerCardsLoadingParams) => {
  return (
    Array.from({ length }).map((_, idx) => (
      <Skeleton key={`tracker-${idx}`} className="rounded-xl h-[90px]"></Skeleton>
    ))
  )
}


const TimeElapsed = ({ createdAt }: { createdAt: Date }) => {
  const [elapsed, setElapsed] = React.useState<string>("");
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    //* very simple time update every minute
    const updateElapsed = () => {
      setElapsed(timeElapsed(createdAt))
      setIsReady(true)
    };

    updateElapsed()

    // maybe add precise calculation to update time elapsed on the minute
    //? idea: modulo operation to find amount of minutes (without seconds) passed to get seconds to next minute and set interval from there one
    //! on hold

    const minuteInterval = setInterval(updateElapsed, 60000); //* 60_000 = 1 minute

    return () => {
      clearInterval(minuteInterval)
    }
  }, [createdAt])

  if (!isReady) return <Skeleton className="w-24 h-5" />

  return <>{elapsed}</>;
};
