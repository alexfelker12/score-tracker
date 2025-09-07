import { TrackerType } from "@prisma/client";
import { LeaderboardCalc } from "../LeaderboardCalcInterface";

type StaticLeaderboardCalc = LeaderboardCalc<{
  nukes: number
}>

export class SchwimmenCalc_TotalNukes implements StaticLeaderboardCalc {
  trackerType = "SCHWIMMEN" as TrackerType
  uniqueUsers: StaticLeaderboardCalc["uniqueUsers"] = new Map()

  getTrackerType() {
    return this.trackerType
  }

  collectMetricValue: StaticLeaderboardCalc["collectMetricValue"] = ({ game }) => {
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
        nukes: 0, // initially no user has nukes, will be filled in the next loop
        user
      })
    }

    for (const round of game.rounds) {
      if (round.data.type !== "SCHWIMMEN") continue;

      //* nukerId = user id of user who nuked
      const nukerId = round.data.nukeBy
      const userId = nukerId && mappedUsers.get(nukerId)
      if (!userId) continue;
      this.uniqueUsers.get(userId)!.nukes++
    }
  }

  calculateMetricValue: StaticLeaderboardCalc["calculateMetricValue"] = () => {
    const mappedOutput = []
    for (const mapEntry of this.uniqueUsers.values()) {
      const user = mapEntry.user
      const metricValue = mapEntry.nukes

      mappedOutput.push({ user, metricValue })
    }

    return mappedOutput
  }

  formatMetricValue: StaticLeaderboardCalc["formatMetricValue"] = (metricValue) => {
    return `${metricValue}`
  }

}
