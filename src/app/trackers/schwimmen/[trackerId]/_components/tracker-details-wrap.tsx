import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getTrackerById } from "@/server/actions/tracker/actions";

import { getQueryClient } from "@/lib/get-query-client";

import { TrackerDetails } from "./tracker-details";


export type TrackerDetailsWrapProps = {
  trackerId: string
}

export const TrackerDetailsWrap = async (trackerParams: TrackerDetailsWrapProps) => {
  const { trackerId } = trackerParams
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["trackers", trackerId],
    queryFn: () => getTrackerById(trackerId)
  })

  return (
    <HydrationBoundary
      state={dehydrate(qc)}
    >
      <TrackerDetails {...trackerParams}/>
    </HydrationBoundary>
  );
}
