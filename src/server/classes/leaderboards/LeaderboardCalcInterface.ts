import { getCompletedGames, LeaderboardEntryUserType } from "@/server/actions/leaderboards/functions"
import { Prisma, TrackerType } from "@prisma/client"

export interface LeaderboardCalc<T> {
  // static
  uniqueUsers: Map<string, { user: LeaderboardEntryUserType } & T>
  trackerType: TrackerType
  getTrackerType: () => TrackerType

  // calc methods
  collectMetricValue: (params: {
    game: Prisma.PromiseReturnType<typeof getCompletedGames>[number]
  }) => void

  calculateMetricValue: () => {
    user: LeaderboardEntryUserType
    metricValue: number
  }[]

  formatMetricValue: (metricValue: number) => string
}

// TODO: create an abstract base implementation because currently all calcClasses (except winrate) have the same calculate and formatMetricValue logic, only difference is the generic property. Override is always possible...
