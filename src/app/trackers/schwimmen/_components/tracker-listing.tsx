import { Prisma, TrackerName } from "@prisma/client/edge";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getAllArchivedTrackersForCreator, getAllTrackersByCreator, getAllTrackersAsParticipant } from "@/server/actions/tracker/actions";

import { getQueryClient } from "@/lib/get-query-client";

import { Trackers } from "./trackers";


export const queryFuncMap = {
  getAllTrackersByCreator: "from-creator",
  getAllTrackersAsParticipant: "as-player",
  getAllArchivedTrackersForCreator: "archived"
} as const

export type TrackerListingParams = {
  trackerName: TrackerName
  userId: string
  queryFunc: (
    trackerName: TrackerName,
    userId: string
  ) => Promise<
    Prisma.PromiseReturnType<typeof getAllTrackersByCreator> |
    Prisma.PromiseReturnType<typeof getAllTrackersAsParticipant> |
    Prisma.PromiseReturnType<typeof getAllArchivedTrackersForCreator>
  >
  queryFuncName: keyof typeof queryFuncMap; // Enforce allowed function names
}

export const TrackerListing = async (trackerParams: TrackerListingParams) => {
  const { trackerName, userId, queryFunc, queryFuncName } = trackerParams
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerName, userId, queryFuncMap[queryFuncName]],
    queryFn: () => queryFunc(trackerName, userId)
  })

  return (
    <HydrationBoundary
      state={dehydrate(qc)}
    >
      <Trackers {...trackerParams}/>
    </HydrationBoundary>
  );
}
