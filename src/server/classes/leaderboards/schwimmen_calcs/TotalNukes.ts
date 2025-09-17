import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type TotalNukesEntry = { nukes: number }
type TotalNukesCalc = LeaderboardCalc<TotalNukesEntry>

export class SchwimmenCalc_TotalNukes
  extends BaseLeaderboardCalc<TotalNukesEntry, "nukes"> {

  trackerType = "SCHWIMMEN" as const

  collectMetricValue: TotalNukesCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    // first map all GameParticipants to their user, if user exists
    const mappedUsers = new Map<string, string>()
    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      // create temporary connection between GameParticipant id and user id
      mappedUsers.set(p.id, p.userId)

      // call to initially set this user
      this.ensureUser(p.userId, p.user, {
        nukes: 0,
      })
    }

    // then count nukes which appeared in the rounds
    for (const round of game.rounds) {
      if (round.data.type !== this.trackerType) continue;

      // nukerId = participant id of user who nuked
      const nukerId = round.data.nukeBy
      const userId = nukerId && mappedUsers.get(nukerId)
      if (!userId) continue;

      // because of previous init entry is definitely defined
      const entry = this.uniqueUsers.get(userId)!
      entry.nukes++
    }
  }

}
