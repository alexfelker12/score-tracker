import { Prisma, TrackerName } from "@prisma/client/edge";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getAllArchivedTrackersForCreator, getAllTrackersByCreator, getAllTrackersForParticipant } from "@/server/actions/tracker/actions";

import { getQueryClient } from "@/lib/get-query-client";

import { Trackers } from "./trackers";


export type TrackerListingParams = {
  trackerName: TrackerName
  userId: string
  queryFunc: (
    trackerName: TrackerName,
    userId: string
  ) => Promise<
    Prisma.PromiseReturnType<typeof getAllTrackersByCreator> |
    Prisma.PromiseReturnType<typeof getAllTrackersForParticipant> |
    Prisma.PromiseReturnType<typeof getAllArchivedTrackersForCreator>
  >
}

export const TrackerListing = async (trackerParams: TrackerListingParams) => {
  const { trackerName, userId, queryFunc } = trackerParams
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerName],
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
