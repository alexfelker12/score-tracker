"use client"

//* react/next
import Link from "next/link";
import React from "react";

//* packages
import { Tracker, TrackerName } from "@prisma/client/edge";
import { useMutationState, useQuery } from "@tanstack/react-query";

//* actions
import { getAllPastTrackers, getAllTodaysTrackers } from "@/server/actions/trackerActions";

//* lib
import { timeElapsed } from "@/lib/utils";

//* hooks
import { useDeleteTracker, UseHandleDeleteFunc } from "@/hooks/use-delete-tracker";

//* schema
import { participantsSchemaBase } from "@/schema/participants";

//* icons
import { ArrowRightIcon, Trash2Icon } from "lucide-react";

//* components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export type TrackerListProps = {
  trackerName: TrackerName
}
export const TrackerListToday = ({ trackerName }: TrackerListProps) => {
  //* GET all schwimmen trackers created today
  const { data, isFetching, isPending } = useQuery({
    queryKey: ["trackers", trackerName, "today"],
    queryFn: () => getAllTodaysTrackers(trackerName),
    refetchOnMount: false,
    refetchOnReconnect: false
  })


  //* DELETE mutation: tracker
  const { deleteTracker, isDeletePending } = useDeleteTracker()

  //* get status of create mutation to display loading skeleton for new tracker
  const isCreatePending = useMutationState({
    filters: { mutationKey: ['tracker-create', trackerName], status: 'pending' },
    select: (mutation) => mutation.state.status === 'pending',
  })[0];

  //* loading
  if (isPending) return <TrackerCardsLoading />
  //* no trackers | show if:
  if ((data && data.data && data.data.length === 0) // ...no trackers in list
    && !(isCreatePending && isFetching) // ...and trackers not fetching and create pending
  ) return (
    <div className="flex justify-center col-span-2 p-4 border rounded-md">
      <span className="text-muted-foreground text-sm">No trackers created today. <Button
        variant="link"
        className="p-0 h-auto"
        asChild
      >
        <a href={"#firstPlayer"}>Create one above</a>
      </Button>
      </span>
    </div>
  )
  //* listing
  if (data && data.data) return (
    <>
      {(isCreatePending && isFetching) && <TrackerCardsLoading length={1} />}
      {data.data.map((tracker) => (
        <TrackerCard
          key={tracker.id}
          deleteTracker={deleteTracker}
          isPending={isDeletePending}
          {...tracker}
        />
      ))}
    </>
  )
}

export const TrackerListPast = ({ trackerName }: TrackerListProps) => {
  //* GET all schwimmen trackers created in the past
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["trackers", trackerName, "past"],
    queryFn: () => getAllPastTrackers(trackerName),
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  //* DELETE mutation: tracker
  const { deleteTracker, isDeletePending } = useDeleteTracker()

  //* loading
  if (isPending || isLoading) return (
    <TrackerCardsLoading />
  )
  //* no trackers
  if (data && data.data && data.data.length === 0) return (
    <div className="flex justify-center col-span-2 p-4 border rounded-md">
      <span className="text-muted-foreground text-sm">There are no trackers created in the past</span>
    </div>
  )
  //* listing
  if (data && data.data) return (
    data.data.map((tracker) => (
      <TrackerCard
        key={tracker.id}
        deleteTracker={deleteTracker}
        isPending={isDeletePending}
        {...tracker}
      />
    ))
  )
}


export type TrackerCardParams = Tracker & {
  deleteTracker: UseHandleDeleteFunc
  isPending: boolean
}
export const TrackerCard = ({ id, name, createdAt, playerData, isPending, deleteTracker }: TrackerCardParams) => {
  //* parse playerData to get amount of players
  const { success, data: parsedData } = participantsSchemaBase.shape.players.safeParse(playerData);

  return (
    <Card className="justify-between gap-4 py-4 w-full h-full transition-all">
      <CardHeader className="flex-row justify-between items-start gap-4 px-4">

        {/* tracker name & time elapsed since now */}
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-lg leading-none">{name}</CardTitle>
          {/* amount of players in this tracker */}
          <CardDescription className="leading-none">
            <span className="text-muted-foreground text-sm">{success && `${parsedData.length} Players`}</span>
          </CardDescription>
        </div>

        {/* time since creation */}
        <span className="text-muted-foreground text-sm leading-none">
          <TimeElapsed createdAt={createdAt} />
        </span>

      </CardHeader>
      <CardContent className="flex justify-between items-center px-4">
        {/* delete tracker  */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              disabled={isPending}
            >
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete tracker</AlertDialogTitle>
              <AlertDialogDescription>The tracker will be deleted and data cannot be accessed anymore. Continue?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => { if (!isPending) deleteTracker(id) }}
              >Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
      <Skeleton key={`today-${idx}`} className="rounded-xl h-[124px]"></Skeleton>
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
