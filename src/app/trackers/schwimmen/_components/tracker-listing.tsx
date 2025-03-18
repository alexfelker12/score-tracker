import { getAllTrackers } from "@/server/actions/trackerActions";
import { TrackerName } from "@prisma/client/edge";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";
import { TrackerList } from "./tracker-list";


export type TrackerListingType = {
  trackerName: TrackerName
}

export const TrackerListing = async ({ trackerName }: TrackerListingType) => {
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerName],
    queryFn: () => getAllTrackers(trackerName)
  })

  return (
    // <HydrationBoundary
    //   state={dehydrate(qc)}
    // >
      <TrackerList trackerName={trackerName} />
    // </HydrationBoundary>
  );
}
