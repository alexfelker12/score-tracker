import { TrackerType } from "@prisma/client";
import { SchwimmenCalc } from "../classes/leaderboards/SchwimmenCalc";


/**
 * provides the leaderboard calc class instance
 * 
 * @param trackerType TrackerType
 * @returns LeaderboardCalc of TrackerType
 */
export function getLeaderboardCalcClass(trackerType: TrackerType) {
  switch (trackerType) {
    case "DURAK":
      // return new DurakCalc() // as soon as it exists
      break;

    case "SCHWIMMEN":
    default:
      return new SchwimmenCalc()
  }
}