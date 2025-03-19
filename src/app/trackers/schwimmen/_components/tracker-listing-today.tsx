import { getAllTodaysTrackers } from "@/server/actions/trackerActions";
import { TrackerName } from "@prisma/client/edge";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";
import { TrackerListToday } from "./tracker-list";


export type TrackerListingTodayType = {
  trackerName: TrackerName
}

export const TrackerListingToday = async ({ trackerName }: TrackerListingTodayType) => {
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerName],
    queryFn: () => getAllTodaysTrackers(trackerName)
  })

  return (
    <HydrationBoundary
      state={dehydrate(qc)}
    >
      <TrackerListToday trackerName={trackerName} />
    </HydrationBoundary>
  );
}
