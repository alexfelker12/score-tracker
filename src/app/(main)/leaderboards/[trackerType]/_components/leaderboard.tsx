"use client"

//* packages
import { TrackerType } from "@prisma/client";

//* server
// import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";

//* hooks
import { useLeaderboardQuery } from "@/hooks/use-leaderboard-query";

//* local
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const { metric, trackerIds } = useLeaderboardFilterStore()

  // query
  const { data, isFetching } = useLeaderboardQuery({
    // initialData: metric === "total-wins" ? dataPromise : undefined,
    trackerType, trackerIds, metric
  })

  if (isFetching) return <LoadingSpinner />
  if (data && data.error) return <ErrorMessage message="Could not load leaderboard, try again later." />
  if (data && !data.data.length) return <EmptyLeaderboard
  // trackerType={trackerType}
  />

  if (data && data.data) return (
    <div className="flex flex-col gap-y-2">
      {data.data.map((entry) => {
        return (
          <LeaderboardEntry key={entry.user.id} entry={entry} />
        )
      })}
    </div >
  );
}

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-1 justify-center items-center h-20">
      <Loader2Icon className="text-primary animate-spin size-8" />
    </div>
  );
}

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <p>{message}</p>
  );
}

const EmptyLeaderboard = (
  // { trackerType }: { trackerType: TrackerType }
) => {
  // const metric = useLeaderboardFilterStore((state) => state.metric)
  // const { metricObj, MetricIcon } = getMetricObj(metric)

  // PATH_TO_TRACKERPROPS[trackerType.toLowerCase() as keyof typeof PATH_TO_TRACKERPROPS].title
  // ^ title

  return (
    <Alert>
      <AlertCircleIcon />
      <AlertTitle>Leaderboard empty!</AlertTitle>
      <AlertDescription>
        {/* <div> */}
        <p> There is currently no data for this metric </p>
        {/* <p className="font-bold">
            <MetricIcon className="inline-block size-4 align-middle" />
            <span className="align-middle"> {metricObj?.name}</span>
          </p> */}
        {/* </div> */}
      </AlertDescription>
    </Alert>
  );
}
