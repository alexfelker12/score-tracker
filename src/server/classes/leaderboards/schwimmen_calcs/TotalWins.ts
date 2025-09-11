import { TrackerType } from "@prisma/client";
import { LeaderboardCalc } from "../LeaderboardCalcInterface";

type StaticLeaderboardCalc = LeaderboardCalc<{
  wins: number
}>

export class SchwimmenCalc_TotalWins implements StaticLeaderboardCalc {
  trackerType = "SCHWIMMEN" as TrackerType
  uniqueUsers: StaticLeaderboardCalc["uniqueUsers"] = new Map()

  getTrackerType() {
    return this.trackerType
  }

  collectMetricValue: StaticLeaderboardCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== "SCHWIMMEN") return;

    for (const participant of game.participants) {
      const userId = participant.userId
      const user = participant.user
      if (!userId || !user) continue; // only evaluate participants who are users

      const uniqueUsers = this.uniqueUsers
      if (uniqueUsers.has(userId)) {
        // increment win count if winner
        if (game.gameData.winner === participant.id) uniqueUsers.get(userId)!.wins++
      } else {
        uniqueUsers.set(userId, {
          wins: game.gameData.winner === participant.id ? 1 : 0, // 1 if initial appearance is also a win,
          user
        })
      }
    }
  }

  calculateMetricValue: StaticLeaderboardCalc["calculateMetricValue"] = () => {
    const mappedOutput = []
    for (const mapEntry of this.uniqueUsers.values()) {
      const user = mapEntry.user
      const metricValue = mapEntry.wins

      mappedOutput.push({ user, metricValue })
    }

    return mappedOutput
  }

  formatMetricValue: StaticLeaderboardCalc["formatMetricValue"] = (metricValue) => {
    return `${metricValue}`
  }

}
