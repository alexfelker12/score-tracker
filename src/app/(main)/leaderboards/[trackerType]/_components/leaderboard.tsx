"use client"

//* packages
import { TrackerType } from "@prisma/client";

//* server
// import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";

//* hooks
import { useLeaderboardQuery } from "@/hooks/use-leaderboard-query";

//* local
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PATH_TO_TRACKERPROPS } from "@/lib/constants";
import { useLeaderboardFilterStore } from "@/store/leaderboardFilterStore";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { LeaderboardEntry } from "./leaderboard-entry";


//? see src\hooks\use-leaderboard-query.ts
export type LeaderboardProps = {
  // dataPromise: ReturnType<typeof getLeaderboardByTrackerType>
  trackerType: TrackerType
}
export const Leaderboard = ({ trackerType }: LeaderboardProps) => {
  // metric
  const metric = useLeaderboardFilterStore((state) => state.metric)

  // query
  const { data, isFetching } = useLeaderboardQuery({
    // initialData: metric === "total-wins" ? dataPromise : undefined,
    trackerType,
    metric
  })

  if (isFetching) return <LoadingLeaderboard />
  if (data && data.error) return <ErrorMessage />
  if (data && !data.data.length) return <EmptyLeaderboard trackerType={trackerType} />

  if (data && data.data) return (
    <div className="flex flex-col gap-y-4">
      {data.data.map((entry) => {
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
    <Alert>
      <AlertCircleIcon />
      <AlertTitle>Wow such empty!</AlertTitle>
      <AlertDescription>
        <span>
          There is currently no leaderboard data for the game <span className="font-bold">
            {PATH_TO_TRACKERPROPS[trackerType.toLowerCase() as keyof typeof PATH_TO_TRACKERPROPS].title}
          </span>
        </span>
      </AlertDescription>
    </Alert>
  );
}

const LoadingLeaderboard = () => {
  return (
    <div className="flex flex-1 justify-center items-center">
      <Loader2Icon className="text-primary animate-spin size-8" />
    </div>
  );
}
