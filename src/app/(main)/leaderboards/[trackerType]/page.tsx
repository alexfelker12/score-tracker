import { notFound } from "next/navigation";
// import { Suspense } from "react";

// import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";

import { extractTrackerPathType, isValidTrackerType } from "@/lib/utils";

// import { Loader2Icon } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeaderboardFilter } from "./_components/filter/leaderboard-filter";
import { Leaderboard } from "./_components/leaderboard";
import { LeaderboardHead } from "./_components/filter/leaderboard-head";


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

  //? see src\hooks\use-leaderboard-query.ts
  // const leaderboard = getLeaderboardByTrackerType({
  //   trackerType: finalTrackerType,
  //   metric: "total-wins"
  // });

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <section className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between gap-4">
            <h2 className="font-bold text-2xl">{finalTrackerTitle}</h2>

            <LeaderboardFilter />
          </div>
        </div>

        <div className="space-y-2">
          <LeaderboardHead />

          {/* <Suspense fallback={
          <div className="flex flex-1 justify-center items-center">
          <Loader2Icon className="text-primary animate-spin size-8" />
          </div>
          }> */}
          <Leaderboard
            // dataPromise={leaderboard} 
            trackerType={finalTrackerType}
          />
          {/* </Suspense> */}
        </div>
      </section>

    </main>
  );
}
