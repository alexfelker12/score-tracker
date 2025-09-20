import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type TotalSwimmerEntry = { swimmer: number }
type TotalSwimmerCalc = LeaderboardCalc<TotalSwimmerEntry>

export class SchwimmenCalc_TotalSwimmer
  extends BaseLeaderboardCalc<TotalSwimmerEntry, "swimmer"> {

  trackerType = "SCHWIMMEN" as const

  collectMetricValue: TotalSwimmerCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      if (game.gameData.swimming === p.id) {
        const entry = this.ensureUser(p.userId, p.user, {
          swimmer: 0,
        })
        entry.swimmer++
      }

    }
  }

}
