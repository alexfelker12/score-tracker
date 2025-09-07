import { TrackerType } from "@prisma/client";
import { SchwimmenCalc_TotalWins } from "../classes/leaderboards/schwimmen_calcs/TotalWins";
import { SchwimmenCalc_Winrate } from "../classes/leaderboards/schwimmen_calcs/Winrate";
import { SchwimmenCalc_TotalGames } from "../classes/leaderboards/schwimmen_calcs/TotalGames";
import { SchwimmenCalc_TotalNukes } from "../classes/leaderboards/schwimmen_calcs/TotalNukes";


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
      return new SchwimmenCalc_Winrate()
    case "SCHWIMMEN-total-wins":
      return new SchwimmenCalc_TotalWins()
    case "SCHWIMMEN-total-games":
      return new SchwimmenCalc_TotalGames()
    case "SCHWIMMEN-total-nukes":
      return new SchwimmenCalc_TotalNukes()
    // case "SCHWIMMEN-total-unbreakable":
    //   return new SchwimmenCalc_TotalUnbreakable()
    // case "SCHWIMMEN-total-untouchable":
    //   return new SchwimmenCalc_TotalUntouchable()
    // case "SCHWIMMEN-total-times-swimmer":
    //   return new SchwimmenCalc_TotalUnbreakable()
    // case "SCHWIMMEN-average-times-swimmer":
    //   return new SchwimmenCalc_TotalUntouchable()
    // case "SCHWIMMEN-total-finale-appearances":
    //   return new SchwimmenCalc_TotalUnbreakable()
    // case "SCHWIMMEN-average-finale-appearances":
    //   return new SchwimmenCalc_TotalUntouchable()

    default:
  }
}