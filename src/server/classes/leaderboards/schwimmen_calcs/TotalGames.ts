import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type TotalGamesEntry = { appearances: number }
type TotalGamesCalc = LeaderboardCalc<TotalGamesEntry>

export class SchwimmenCalc_TotalGames
  extends BaseLeaderboardCalc<TotalGamesEntry, "appearances"> {
    
  trackerType = "SCHWIMMEN" as const

  collectMetricValue: TotalGamesCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      const entry = this.ensureUser(p.userId, p.user, {
        appearances: 0,
      })

      entry.appearances++
    }
  }

}
