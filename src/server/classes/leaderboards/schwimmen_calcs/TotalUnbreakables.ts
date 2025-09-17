import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type TotalUnbreakablesEntry = { unbreakables: number }
type TotalUnbreakablesCalc = LeaderboardCalc<TotalUnbreakablesEntry>

export class SchwimmenCalc_TotalUnbreakables
  extends BaseLeaderboardCalc<TotalUnbreakablesEntry, "unbreakables"> {

  trackerType = "SCHWIMMEN" as const

  collectMetricValue: TotalUnbreakablesCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    const winnerId = game.gameData.winner
    const swimmerId = game.gameData.swimming

    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      const entry = this.ensureUser(p.userId, p.user, {
        unbreakables: 0,
      })

      if (winnerId === p.id && swimmerId === p.id) entry.unbreakables++
    }
  }

}
