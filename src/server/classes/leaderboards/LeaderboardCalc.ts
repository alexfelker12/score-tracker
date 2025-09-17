import { Prisma, TrackerType } from "@prisma/client"
import { getCompletedGames, LeaderboardEntryUserType } from "@/server/actions/leaderboards/functions"

/**
 * interface which implements base class for leaderboard calculation
 */
export interface LeaderboardCalc<T extends Record<string, any>> {
  trackerType: TrackerType
  uniqueUsers: Map<string, { user: LeaderboardEntryUserType } & T>

  collectMetricValue: (params: {
    game: Prisma.PromiseReturnType<typeof getCompletedGames>[number]
  }) => void

  calculateMetricValue: () => {
    user: LeaderboardEntryUserType
    metricValue: number
  }[]

  formatMetricValue: (metricValue: number) => string
}

/**
 * abstract base class implementation, which centralizes common functionality for less code duplication
 */
export abstract class BaseLeaderboardCalc<
  T extends Record<string, any>,
  K extends keyof T = keyof T
> implements LeaderboardCalc<T> {
  abstract trackerType: TrackerType
  protected metricKey: K
  uniqueUsers = new Map<string, { user: LeaderboardEntryUserType } & T>()

  constructor(metricKey: K) {
    this.metricKey = metricKey
  }

  protected ensureUser(
    userId: string,
    user: LeaderboardEntryUserType,
    initial: T
  ): { user: LeaderboardEntryUserType } & T {
    if (!this.uniqueUsers.has(userId)) {
      this.uniqueUsers.set(userId, { user, ...initial })
    }
    return this.uniqueUsers.get(userId)!
  }

  abstract collectMetricValue(params: {
    game: Prisma.PromiseReturnType<typeof getCompletedGames>[number]
  }): void

  calculateMetricValue() {
    return Array.from(this.uniqueUsers.values()).map(entry => ({
      user: entry.user,
      metricValue: entry[this.metricKey] as number,
    }))
  }

  formatMetricValue(value: number) {
    return value.toString()
  }
}
