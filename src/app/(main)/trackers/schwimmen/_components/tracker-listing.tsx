import { Prisma, TrackerType } from "@prisma/client/edge";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getAllArchivedTrackersForCreator, getAllTrackersAsParticipant, getAllTrackersByCreator } from "@/server/actions/tracker/actions";

import { getQueryClient } from "@/lib/get-query-client";

import { Trackers } from "./trackers";


export const queryFuncMap = {
  getAllTrackersByCreator: "from-creator",
  getAllTrackersAsParticipant: "as-player",
  getAllArchivedTrackersForCreator: "archived"
} as const

export type TrackerListingParams = {
  trackerType: TrackerType
  userId: string
  queryFunc: (
    trackerType: TrackerType,
    userId: string
  ) => Promise<
    Prisma.PromiseReturnType<typeof getAllTrackersByCreator> |
    Prisma.PromiseReturnType<typeof getAllTrackersAsParticipant> |
    Prisma.PromiseReturnType<typeof getAllArchivedTrackersForCreator>
  >
  queryFuncName: keyof typeof queryFuncMap
}

export const TrackerListing = async (trackerParams: TrackerListingParams) => {
  const { trackerType, userId, queryFunc, queryFuncName } = trackerParams
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerType, userId, queryFuncMap[queryFuncName]],
    queryFn: () => queryFunc(trackerType, userId)
  })

  // await delay(2000)

  return (
    <HydrationBoundary
      state={dehydrate(qc)}
    >
      <Trackers {...trackerParams}/>
    </HydrationBoundary>
  );
}
