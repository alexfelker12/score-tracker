import { getCompletedGames } from "@/server/actions/leaderboards/functions";
import { Prisma } from "@prisma/client";
import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type WinrateEntry = { totalWins: number; totalGames: number }
type WinrateCalc = LeaderboardCalc<WinrateEntry>

export class SchwimmenCalc_Winrate
  extends BaseLeaderboardCalc<WinrateEntry, "totalGames"> {

  trackerType = "SCHWIMMEN" as const

  // no constructor -> unnecessary because of overrite

  collectMetricValue: WinrateCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      const entry = this.ensureUser(p.userId, p.user, {
        totalWins: 0,
        totalGames: 0,
      })

      entry.totalGames++
      if (game.gameData.winner === p.id) entry.totalWins++
    }
  }

  calculateMetricValue: WinrateCalc["calculateMetricValue"] = () => {
    return Array.from(this.uniqueUsers.values()).map(e => ({
      user: e.user,
      metricValue: parseFloat((e.totalWins / e.totalGames).toFixed(4)),
    }))
  }

  formatMetricValue: WinrateCalc["formatMetricValue"] = (value) => {
    return `${(value * 100).toFixed(2)}%`
  }
  
}
