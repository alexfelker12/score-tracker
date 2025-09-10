"use client"

//* packages
import { TrackerType } from "@prisma/client";

//* server
import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";

//* hooks
import { useLeaderboardQuery } from "@/hooks/use-leaderboard-query";

//* local
import { Loader2Icon } from "lucide-react";
import { LeaderboardEntry } from "./leaderboard-entry";
import { PATH_TO_TRACKERPROPS } from "@/lib/constants";


export type LeaderboardProps = {
  dataPromise: ReturnType<typeof getLeaderboardByTrackerType>
  trackerType: TrackerType
}
export const Leaderboard = ({ trackerType, dataPromise }: LeaderboardProps) => {
  const { data: { data: leaderboard, error }, isFetching } = useLeaderboardQuery({
    initialData: dataPromise,
    trackerType,
    metric: "total-wins"
  })


  if (isFetching) return <LoadingLeaderboard />

  if (error) return <ErrorMessage />
  if (!leaderboard.length) return <EmptyLeaderboard trackerType={trackerType} />

  if (leaderboard) return (
    <div className="flex flex-col gap-y-4">
      {leaderboard.map((entry) => {
        return (
          <LeaderboardEntry key={entry.user.id} entry={entry} />
        )
      })}
    </div >
  );
}

const ErrorMessage = () => {
  return (
    <p>Could not load leaderboard, try again later.</p>
  );
}

const EmptyLeaderboard = ({ trackerType }: { trackerType: TrackerType }) => {
  return (
    <p>
      There is currently no leaderboard data for the game
      {PATH_TO_TRACKERPROPS[trackerType.toLowerCase() as keyof typeof PATH_TO_TRACKERPROPS].title}
    </p>
  );
}

const LoadingLeaderboard = () => {
  return (
    <div className="flex flex-1 justify-center items-center">
      <Loader2Icon className="text-primary animate-spin size-8" />
    </div>
  );
}
