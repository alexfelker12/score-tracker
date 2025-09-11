import { TrackerType } from "@prisma/client";
import { LeaderboardCalc } from "../LeaderboardCalcInterface";

type StaticLeaderboardCalc = LeaderboardCalc<{
  unbreakables: number
}>

export class SchwimmenCalc_TotalUnbreakables implements StaticLeaderboardCalc {
  trackerType = "SCHWIMMEN" as TrackerType
  uniqueUsers: StaticLeaderboardCalc["uniqueUsers"] = new Map()

  getTrackerType() {
    return this.trackerType
  }

  collectMetricValue: StaticLeaderboardCalc["collectMetricValue"] = ({ game }) => {
    if (game.gameData.type !== "SCHWIMMEN") return
    const winnerId = game.gameData.winner
    const swimmerId = game.gameData.swimming

    for (const participant of game.participants) {
      const userId = participant.userId
      const user = participant.user
      if (!userId || !user) continue; // only evaluate participants who are users

      const uniqueUsers = this.uniqueUsers
      const didUnbreakable = winnerId === participant.id && swimmerId === participant.id
      if (uniqueUsers.has(userId)) {
        if (didUnbreakable) uniqueUsers.get(userId)!.unbreakables++
      } else {
        uniqueUsers.set(userId, {
          unbreakables: didUnbreakable ? 1 : 0, // 1 if initial win is also a unbreakable,
          user
        })
      }
    }
  }

  calculateMetricValue: StaticLeaderboardCalc["calculateMetricValue"] = () => {
    const mappedOutput = []
    for (const mapEntry of this.uniqueUsers.values()) {
      const user = mapEntry.user
      const metricValue = mapEntry.unbreakables

      mappedOutput.push({ user, metricValue })
    }

    return mappedOutput
  }

  formatMetricValue: StaticLeaderboardCalc["formatMetricValue"] = (metricValue) => {
    return `${metricValue}`
  }

}
