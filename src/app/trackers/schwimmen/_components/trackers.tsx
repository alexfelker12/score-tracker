"use client"

//* react/next
import Link from "next/link";
import React from "react";

//* packages
import { Tracker } from "@prisma/client/edge";
import { useMutationState, useQuery } from "@tanstack/react-query";

//* actions

//* lib
import { timeElapsed } from "@/lib/utils";

//* hooks
import { useDeleteTracker, UseHandleDeleteFunc } from "@/hooks/use-delete-tracker";

//* schema

//* icons
import { ArrowRightIcon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

import { queryFuncMap, TrackerListingParams } from "./tracker-listing";


export type TrackersProps = TrackerListingParams
export const Trackers = ({ trackerName, userId, queryFunc, queryFuncName }: TrackersProps) => {
  //* GET data by query function
  const { data, isFetching, isPending } = useQuery({
    queryKey: ["trackers", trackerName, userId, queryFuncMap[queryFuncName]],
    queryFn: () => queryFunc(trackerName, userId),
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  console.log(queryFuncName, data)

  //* DELETE mutation: tracker
  const { deleteTracker, isDeletePending } = useDeleteTracker()

  //* get status of create mutation to display loading skeleton for new tracker
  const isCreatePending = useMutationState({
    filters: { mutationKey: ['tracker-create', trackerName], status: 'pending' },
    select: (mutation) => mutation.state.status === 'pending',
  })[0];

  //* error-case
  if (!data || data && data.error) return;

  //* loading
  if (isPending) return <TrackerCardsLoading />

  //* listing
  if (data && data) return (
    <Command className="shadow-md border w-full">
      <CommandInput placeholder="Search trackers..." />
      <CommandList>
        <CommandEmpty>No trackers found</CommandEmpty>
        {/* <CommandGroup heading="Suggestions"> */}
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
              {...tracker}
            />
          </CommandItem>
        ))}
        {/* </CommandGroup> */}
      </CommandList>
    </Command>
  )
}

export type TrackerCardParams = Tracker & {
  deleteTracker: UseHandleDeleteFunc
  isPending: boolean
}
//TODO adjust TrackerCard to new db schema/app logic
export const TrackerCard = ({ id, name, createdAt, isPending }: TrackerCardParams) => {
  return (
    <Card className="justify-between gap-4 py-4 w-full h-full transition-all">
      <CardHeader className="flex-row justify-between items-start gap-4 px-4">

        {/* tracker name & time elapsed since now */}
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-lg leading-none">{name}</CardTitle>
          {/* amount of players in this tracker */}
          <CardDescription className="leading-none">
            <span className="text-muted-foreground text-sm">See tracker details in the tracker directly</span>
          </CardDescription>
        </div>

        {/* time since creation */}
        <span className="text-muted-foreground text-sm leading-none">
          <TimeElapsed createdAt={createdAt} />
        </span>

      </CardHeader>
      <CardContent className="flex justify-between items-center px-4">
        {/* link to tracker */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            className="group"
            disabled={isPending}
            asChild
          >
            <Link href={`/trackers/schwimmen/${id}`}>
              Go to tracker <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

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
      <Skeleton key={`tracker-${idx}`} className="rounded-xl h-[124px]"></Skeleton>
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
