import { notFound } from "next/navigation";
import { Suspense } from "react";


import { extractTrackerPathType, isValidTrackerType } from "@/lib/utils";

import { Loader2Icon } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";
import { LeaderboardConfigurizer } from "./_components/filter/leaderboard-config";
import { Leaderboard } from "./_components/leaderboard";


export default async function TrackersPage({
  params,
}: {
  params: Promise<{ trackerType: string }>
}) {
  // get tracker type from dynamic route params
  const { trackerType } = await params

  if (isValidTrackerType(trackerType)) notFound()

  const trackerPathType = extractTrackerPathType(trackerType)
  const finalTrackerType = trackerPathType.trackerType
  const finalTrackerTitle = trackerPathType.title

  const leaderboard = getLeaderboardByTrackerType({
    trackerType: finalTrackerType,
    metric: "total-wins"
  });

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <h2 className="font-bold text-2xl">{finalTrackerTitle}</h2>

          <LeaderboardConfigurizer />
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <Suspense fallback={
          <div className="flex flex-1 justify-center items-center">
            <Loader2Icon className="text-primary animate-spin size-8" />
          </div>
        }>
          <Leaderboard dataPromise={leaderboard} trackerType={finalTrackerType} />
        </Suspense>
      </div>

    </main>
  );
}
