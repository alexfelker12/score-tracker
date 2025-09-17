import { getLeaderboardByTrackerType } from "@/server/actions/leaderboards/actions";
import { GetLeaderboardParams } from "@/server/actions/leaderboards/functions";
import { useQuery } from "@tanstack/react-query";

// import { useSuspenseQuery } from "@tanstack/react-query";
// import { use } from "react";
//! dynamic useSuspenseQuery throws errors and incorrectly renders sometimes
//! unfortunetly have to resort to default useQuery for leaderboard fetching

// &
export const useLeaderboardQuery = ({
  trackerType,
  trackerIds,
  metric,
  // initialData
}: Omit<GetLeaderboardParams, "sortBy">
// & {
//   initialData?: ReturnType<typeof getLeaderboardByTrackerType>
// }
) => {
  return useQuery({
    queryKey: ["leaderboard", trackerType, trackerIds ?? "all", metric],
    queryFn: () => getLeaderboardByTrackerType({ trackerType, metric, trackerIds }),
    // ...(initialData ? { initialData: use(initialData) } : {}),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000 // 10 min
  })
}
