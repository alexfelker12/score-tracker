import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type AverageSwimmerEntry = { totalSwimmer: number; totalGames: number }
type AverageSwimmerCalc = LeaderboardCalc<AverageSwimmerEntry>

export class SchwimmenCalc_AverageSwimmer
  extends BaseLeaderboardCalc<AverageSwimmerEntry, "totalGames"> {

  trackerType = "SCHWIMMEN" as const

  // no constructor -> unnecessary because of overrite

  collectMetricValue: AverageSwimmerCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      const entry = this.ensureUser(p.userId, p.user, {
        totalSwimmer: 0,
        totalGames: 0,
      })

      entry.totalGames++
      if (game.gameData.swimming === p.id) entry.totalSwimmer++
    }
  }

  calculateMetricValue: AverageSwimmerCalc["calculateMetricValue"] = () => {
    return Array.from(this.uniqueUsers.values()).map(e => ({
      user: e.user,
      metricValue: parseFloat((e.totalSwimmer / e.totalGames).toFixed(4)),
    }))
  }

  formatMetricValue: AverageSwimmerCalc["formatMetricValue"] = (value) => {
    return `${(value * 100).toFixed(2)}%`
  }
  
}
