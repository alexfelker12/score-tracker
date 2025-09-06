"use client"

//* next/react
import { use } from "react";

//* packages
import { useSuspenseQuery } from "@tanstack/react-query";

//* local
import { getLeaderboard, LeaderboardEntryType } from "@/server/actions/leaderboards/functions";
import { TrackerType } from "@prisma/client";
import { LeaderboardEntry } from "./leaderboard-entry";

export type LeaderboardProps = {
  dataPromise: Promise<LeaderboardEntryType[]>
  trackerType: TrackerType
}
export const Leaderboard = ({ trackerType, dataPromise }: LeaderboardProps) => {
  // const { data: { data, error }, isPending, isFetching, refetch } = useSuspenseQuery({
  const { data: leaderboard } = useSuspenseQuery({
    initialData: use(dataPromise),
    queryKey: ["leaderboard", trackerType, "all"],
    queryFn: () => getLeaderboard({ trackerType }),
    refetchOnMount: false, refetchOnReconnect: false
  })


  // if (isPending) return <LoadingTrackerDetails />

  // if (error) return <ErrorMessage error={error} />
  // if (!data) return <InvalidTrackerMessage />

  // if (data) 
  return (
    <div className="flex flex-col gap-y-4">
      {leaderboard.map((entry) => {
        return (
          <LeaderboardEntry key={entry.user.id} entry={entry} />
        )
      })}
    </div >
  );
}
