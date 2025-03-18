"use client"

//* react/next
import Link from "next/link";
import React from "react";

//* packages
import { deleteTracker, getAllTrackers } from "@/server/actions/trackerActions";
import { Tracker, TrackerName } from "@prisma/client/edge";
import { useMutation, useMutationState, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

//* lib
import { getQueryClient } from "@/lib/get-query-client";
import { isToday, timeElapsed } from "@/lib/utils";

//* schema
import { participantsSchemaBase } from "@/schema/participants";

//* icons
import { ArrowRightIcon, Trash2Icon } from "lucide-react";

//* components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export type TrackerListProps = {
  trackerName: TrackerName
}
export const TrackerList = ({ trackerName }: TrackerListProps) => {
  //* query client
  const qc = getQueryClient()

  //* GET all schwimmen trackers
  const { data, isFetching, isLoading, isPending } = useQuery({
    queryKey: ["trackers", trackerName],
    queryFn: () => getAllTrackers(trackerName),
    refetchOnMount: false,
    refetchOnReconnect: false
  })


  //* DELETE mutation: tracker
  const { mutate, isPending: isDeletePending } = useMutation({
    // mutationKey: ["delete-tracker"],
    mutationFn: deleteTracker,
    onSettled: (data, error) => {
      if (!error && data) {
        toast.success("Tracker was deleted successfully")
        qc.invalidateQueries({
          queryKey: ["trackers", trackerName],
          // refetchType: "none"
        })
      }
    },
  })
  const handleMutate = (trackerId: string) => {
    mutate(trackerId)
  }

  //* get status of create mutation to display loading skeleton for new tracker
  const isCreatePending = useMutationState({
    filters: { mutationKey: ['tracker-create', trackerName], status: 'pending' },
    select: (mutation) => mutation.state.status === 'pending',
  })[0];


  const todayTrackers = data && data.data
    ? data.data.filter(tracker => isToday(tracker.createdAt))
    : []
  const pastTrackers = data && data.data
    ? data.data.filter(tracker => !isToday(tracker.createdAt))
    : []

  return (
    <Accordion type="multiple" defaultValue={["today"]}>

      {/* trackers created today */}
      <AccordionItem value="today">
        <AccordionTrigger><span className="font-semibold text-lg">Created today</span></AccordionTrigger>

        {/* listing */}
        <AccordionContent className="gap-4 grid md:grid-cols-2">
          {(isCreatePending && isFetching) && <TrackerCard.Loading />}
          {isPending
            ? Array.from({ length: 2 }).map((_, idx) => (
              <TrackerCard.Loading key={`today-${idx}`} />
            ))
            : todayTrackers.length > 0
              ? todayTrackers.map((tracker) => (
                <TrackerCard key={tracker.id} {...tracker} deleteTracker={handleMutate} isPending={isDeletePending} />
              ))
              : !(isCreatePending && isFetching) && <div className="flex justify-center col-span-2 px-3 py-4 border rounded-md">
                <span className="text-muted-foreground text-sm">No trackers created today. <Button
                  variant="link"
                  className="p-0 h-auto"
                  asChild
                >
                  <a href={"#firstPlayer"}>Create one above</a>
                </Button>
                </span>
              </div>
          }
        </AccordionContent>
      </AccordionItem>

      {/* trackers created past time */}
      <AccordionItem value="past">
        <AccordionTrigger><span className="font-semibold text-lg">Created in the past</span></AccordionTrigger>

        {/* listing */}
        <AccordionContent className="gap-4 grid md:grid-cols-2">
          {isPending || isLoading
            ? Array.from({ length: 2 }).map((_, idx) => (
              <TrackerCard.Loading key={`past-${idx}`} />
            ))
            : pastTrackers.length > 0
              ? pastTrackers.map((tracker) => (
                <TrackerCard key={tracker.id} {...tracker} deleteTracker={handleMutate} isPending={isPending} />
              ))
              : <div className="flex justify-center col-span-2 p-4 border rounded-md">
                <span className="text-muted-foreground text-sm">There are no trackers created in the past</span>
              </div>
          }
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  )
}

export type TrackerCardType = Tracker & {
  deleteTracker: (trackerId: string) => void
  isPending: boolean
}
export const TrackerCard = ({ id, name, createdAt, playerData, isPending, deleteTracker }: TrackerCardType) => {
  //* parse playerData to get amount of players
  const { success, data: parsedData } = participantsSchemaBase.shape.players.safeParse(playerData);

  return (
    <Card className="justify-between gap-4 py-4 w-full h-full transition-all">
      <CardHeader className="flex-row justify-between gap-4 px-4">

        {/* tracker name & time elapsed since now */}
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-lg leading-none">{name}</CardTitle>
          {/* amount of players in this tracker */}
          <CardDescription className="leading-none">
            <span className="text-muted-foreground text-sm">{success && `${parsedData.length} Players`}</span>
          </CardDescription>
        </div>

        <div className="text-muted-foreground text-sm">
          {/* time since creation */}
          <TimeElapsed createdAt={createdAt} />
        </div>

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
                onClick={() => deleteTracker(id)}
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
TrackerCard.Loading = () => {
  return (
    <Skeleton className="rounded-xl h-[124px]"></Skeleton>
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

  return <span>{elapsed}</span>;
};
