import { TrackerType } from "@prisma/client";
import { LeaderboardCalc } from "../LeaderboardCalcInterface";

type StaticLeaderboardCalc = LeaderboardCalc<{
  appearance: number
  wins: number
}>

export class SchwimmenCalc_Winrate implements StaticLeaderboardCalc {
  trackerType = "SCHWIMMEN" as TrackerType
  uniqueUsers: StaticLeaderboardCalc["uniqueUsers"] = new Map()

  getTrackerType() {
    return this.trackerType
  }

  collectMetricValue: StaticLeaderboardCalc["collectMetricValue"] = ({ game }) => {
    for (const participant of game.participants) {
      if (game.gameData.type !== "SCHWIMMEN") continue;

      const userId = participant.userId
      const user = participant.user
      if (!userId || !user) continue; // only evaluate participants who are users

      const uniqueUsers = this.uniqueUsers
      if (uniqueUsers.has(userId)) {
        // increment the appearance count and eventually win count
        uniqueUsers.get(userId)!.appearance++
        if (game.gameData.winner === participant.id) uniqueUsers.get(userId)!.wins++
      } else {
        uniqueUsers.set(userId, {
          appearance: 1, // directly set to 1
          wins: game.gameData.winner === participant.id ? 1 : 0, // 1 if initial appearce is also a win,
          user
        })
      }
    }
  }

  calculateMetricValue: StaticLeaderboardCalc["calculateMetricValue"] = () => {
    const mappedOutput = []
    for (const mapEntry of this.uniqueUsers.values()) {
      const user = mapEntry.user
      const metricValue = Number.parseFloat((mapEntry.wins / mapEntry.appearance).toFixed(4)) // appearance will never be 0, because the user would not appear in uniqueUsers if it had 0 appearances

      mappedOutput.push({ user, metricValue })
    }

    return mappedOutput
  }

  formatMetricValue: StaticLeaderboardCalc["formatMetricValue"] = (metricValue) => {
    return `${(metricValue * 100).toFixed(2)}%`
  }

}
