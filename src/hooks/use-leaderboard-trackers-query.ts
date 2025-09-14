import { getAllTrackersForLeaderboard } from "@/server/actions/leaderboards/actions";
import { TrackerType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";


/**
 * useQuery to fetch trackers to selected for leaderboard filter
 * @param trackerType TrackerType
 * @returns useQuery object
 */
export const useLeaderboardTrackersQuery = ({
  trackerType,
}: {
  trackerType: TrackerType
}) => {
  return useQuery({
    queryKey: ["leaderboard", "trackers", trackerType],
    queryFn: () => getAllTrackersForLeaderboard(trackerType),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 min
  })
}
