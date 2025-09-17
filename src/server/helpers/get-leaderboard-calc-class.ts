import { TrackerType } from "@prisma/client";
import { SchwimmenCalc_TotalGames } from "../classes/leaderboards/schwimmen_calcs/TotalGames";
import { SchwimmenCalc_TotalNukes } from "../classes/leaderboards/schwimmen_calcs/TotalNukes";
import { SchwimmenCalc_TotalUnbreakables } from "../classes/leaderboards/schwimmen_calcs/TotalUnbreakables";
import { SchwimmenCalc_TotalUntouchables } from "../classes/leaderboards/schwimmen_calcs/TotalUntouchables";
import { SchwimmenCalc_TotalWins } from "../classes/leaderboards/schwimmen_calcs/TotalWins";
import { SchwimmenCalc_Winrate } from "../classes/leaderboards/schwimmen_calcs/Winrate";


/**
 * provides the leaderboard calc class instance
 * 
 * @param trackerType TrackerType
 * @returns LeaderboardCalc of TrackerType
 */
export function getLeaderboardCalcClass(trackerType: TrackerType, metric: string) {
  switch (trackerType + "-" + metric) {
    //* DURAK
    // case "DURAK":
    //   return new DurakCalc() // as soon as it exists
    //   break;

    //* SCHWIMMEN
    case "SCHWIMMEN-winrate":
      return new SchwimmenCalc_Winrate("totalGames") // <- needs some value for metricKey but is actually unnecessary because its not used
    case "SCHWIMMEN-total-wins":
      return new SchwimmenCalc_TotalWins("wins")
    case "SCHWIMMEN-total-games":
      return new SchwimmenCalc_TotalGames("appearances")
    case "SCHWIMMEN-total-nukes":
      return new SchwimmenCalc_TotalNukes("nukes")
    case "SCHWIMMEN-total-unbreakable":
      return new SchwimmenCalc_TotalUnbreakables("unbreakables")
    case "SCHWIMMEN-total-untouchable":
      return new SchwimmenCalc_TotalUntouchables("untouchables")
    // case "SCHWIMMEN-total-times-swimmer":
    // TODO  return new SchwimmenCalc_TotalUnbreakable()
    // case "SCHWIMMEN-average-times-swimmer":
    // TODO  return new SchwimmenCalc_TotalUntouchable()
    // case "SCHWIMMEN-total-finale-appearances":
    // TODO  return new SchwimmenCalc_TotalUnbreakable()
    // case "SCHWIMMEN-average-finale-appearances":
    // TODO  return new SchwimmenCalc_TotalUntouchable()

    default:
  }
}