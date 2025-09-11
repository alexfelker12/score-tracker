import { TrackerType } from "@prisma/client";
import { LeaderboardCalc } from "../LeaderboardCalcInterface";

type StaticLeaderboardCalc = LeaderboardCalc<{
  untouchables: number
}>

export class SchwimmenCalc_TotalUntouchables implements StaticLeaderboardCalc {
  trackerType = "SCHWIMMEN" as TrackerType
  uniqueUsers: StaticLeaderboardCalc["uniqueUsers"] = new Map()

  getTrackerType() {
    return this.trackerType
  }

  collectMetricValue: StaticLeaderboardCalc["collectMetricValue"] = ({ game }) => {
    // first map all GameParticipants to their user, if user exists
    // first map all GameParticipants to their user, if user exists
    const mappedUsers = new Map<string, string>()
    for (const participant of game.participants) {
      const userId = participant.userId
      const user = participant.user
      if (!userId || !user) continue; // only evaluate participants who are users

      //* create connection between GameParticipant id and user id
      mappedUsers.set(participant.id, userId)

      if (this.uniqueUsers.has(userId)) continue; // user id already in instance's uniqueUsers
      this.uniqueUsers.set(userId, {
        untouchables: 0, // initially no user has untouchables, will be filled in the next loop
        user
      })
    }

    const lastRound = game.rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current)
    if (lastRound.data.type !== "SCHWIMMEN" || game.gameData.type !== "SCHWIMMEN") return;

    const winnerId = game.gameData.winner

    for (const player of lastRound.data.players) {
      if (player.id !== winnerId) continue; // if player not winner continue
      if (player.lifes !== 3) continue; // if player does not have full lifes === has lost a life continue

      const userId = mappedUsers.get(player.id) // this player has done an untouchable
      if (!userId) continue;
      this.uniqueUsers.get(userId)!.untouchables++
    }
  }

  calculateMetricValue: StaticLeaderboardCalc["calculateMetricValue"] = () => {
    const mappedOutput = []
    for (const mapEntry of this.uniqueUsers.values()) {
      const user = mapEntry.user
      const metricValue = mapEntry.untouchables

      mappedOutput.push({ user, metricValue })
    }

    return mappedOutput
  }

  formatMetricValue: StaticLeaderboardCalc["formatMetricValue"] = (metricValue) => {
    return `${metricValue}`
  }

}
