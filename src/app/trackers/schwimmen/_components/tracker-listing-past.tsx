import { getAllPastTrackers } from "@/server/actions/trackerActions";
import { TrackerName } from "@prisma/client/edge";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";
import { TrackerListPast } from "./tracker-list";


export type TrackerListingPastType = {
  trackerName: TrackerName
}

export const TrackerListingPast = async ({ trackerName }: TrackerListingPastType) => {
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerName],
    queryFn: () => getAllPastTrackers(trackerName)
  })

  return (
    <HydrationBoundary
      state={dehydrate(qc)}
    >
      <TrackerListPast trackerName={trackerName} />
    </HydrationBoundary>
  );
}
