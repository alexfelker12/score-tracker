import { BaseLeaderboardCalc, LeaderboardCalc } from "../LeaderboardCalc";

type TotalUntouchablesEntry = { untouchables: number }
type TotalUntouchablesCalc = LeaderboardCalc<TotalUntouchablesEntry>

export class SchwimmenCalc_TotalUntouchables
  extends BaseLeaderboardCalc<TotalUntouchablesEntry, "untouchables"> {

  trackerType = "SCHWIMMEN" as const

  collectMetricValue: TotalUntouchablesCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== this.trackerType) return

    // first map all GameParticipants to their user, if user exists
    const mappedUsers = new Map<string, string>()
    for (const p of game.participants) {
      if (!p.userId || !p.user) continue // only evaluate participants who are users

      // create temporary connection between GameParticipant id and user id
      mappedUsers.set(p.id, p.userId)

      // call to initially set this user
      this.ensureUser(p.userId, p.user, {
        untouchables: 0,
      })
    }

    // get last round of game
    const lastRound = game.rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current)
    if (lastRound.data.type !== this.trackerType || game.gameData.type !== this.trackerType) return;

    const winnerId = game.gameData.winner

    // iterate through players in last round
    for (const player of lastRound.data.players) {
      if (player.id !== winnerId) continue; // if player not winner continue
      if (player.lifes !== 3) continue; // if player does not have full lifes === has lost a life continue

      const userId = mappedUsers.get(player.id) // this player has done an untouchable
      if (!userId) continue;
      // because of previous init entry is definitely defined
      const entry = this.uniqueUsers.get(userId)!
      entry.untouchables++
    }
  }

}
