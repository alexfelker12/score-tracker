import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";
import { getLeaderboard, GetLeaderboardParams } from "@/server/actions/leaderboards/functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";

// &
export const useLeaderboardQuery = ({
  trackerType,
  trackerIds,
  metric,
  initialData
}: Omit<GetLeaderboardParams, "sortBy"> & {
  initialData?: ReturnType<typeof getLeaderboardByTrackerType>
}) => {
  return useSuspenseQuery({
    queryKey: ["leaderboard", trackerType, trackerIds ?? "all", metric],
    queryFn: () => getLeaderboardByTrackerType({ trackerType, metric, trackerIds }),
    ...(initialData ? { initialData: use(initialData) } : {}),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false
  })
}
