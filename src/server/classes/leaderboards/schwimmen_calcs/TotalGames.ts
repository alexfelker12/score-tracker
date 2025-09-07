import { TrackerType } from "@prisma/client";
import { LeaderboardCalc } from "../LeaderboardCalcInterface";

type StaticLeaderboardCalc = LeaderboardCalc<{
  appearance: number
}>

export class SchwimmenCalc_TotalGames implements StaticLeaderboardCalc {
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
      } else {
        uniqueUsers.set(userId, {
          appearance: 1, // directly set to 1
          user
        })
      }
    }
  }

  calculateMetricValue: StaticLeaderboardCalc["calculateMetricValue"] = () => {
    const mappedOutput = []
    for (const mapEntry of this.uniqueUsers.values()) {
      const user = mapEntry.user
      const metricValue = mapEntry.appearance

      mappedOutput.push({ user, metricValue })
    }

    return mappedOutput
  }

  formatMetricValue: StaticLeaderboardCalc["formatMetricValue"] = (metricValue) => {
    return `${metricValue}`
  }

}
