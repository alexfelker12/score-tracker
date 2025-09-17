import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type TotalWinsEntry = { wins: number }
type TotalWinsCalc = LeaderboardCalc<TotalWinsEntry>

export class SchwimmenCalc_TotalWins
  extends BaseLeaderboardCalc<TotalWinsEntry, "wins"> {

  trackerType = "SCHWIMMEN" as const

  collectMetricValue: TotalWinsCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      const entry = this.ensureUser(p.userId, p.user, {
        wins: 0,
      })

      if (game.gameData.winner === p.id) entry.wins++
    }
  }

}
