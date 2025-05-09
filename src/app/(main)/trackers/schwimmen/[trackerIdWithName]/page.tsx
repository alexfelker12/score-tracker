import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getTrackerById } from "@/server/actions/tracker/actions";

import { limitCharacters } from "@/lib/utils";
import { getQueryClient } from "@/lib/get-query-client";

import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";

import { TrackerDetails } from "./_components/tracker-details";


export default async function TrackerPage({
  params,
}: {
  params: Promise<{ trackerIdWithName: string }>
}) {
  const { trackerIdWithName } = await params

  const trackerIdSplits = trackerIdWithName.split("-", 2);
  const trackerId = trackerIdSplits[0]
  const displayName = decodeURIComponent(trackerIdSplits[1])
  const navTrailName = limitCharacters(displayName, 11) || "Tracker"

  const dynNavTrail: BreadcrumbType = {
    name: navTrailName
  }

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs lastTrail={dynNavTrail} />
      <TrackerDetailsWrap trackerId={trackerId} />
    </main>
  );
}


export type TrackerDetailsWrapProps = {
  trackerId: string
}

const TrackerDetailsWrap = async (trackerParams: TrackerDetailsWrapProps) => {
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
      <TrackerDetails {...trackerParams} />
    </HydrationBoundary>
  );
}
