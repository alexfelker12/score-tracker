"use server"

import { prisma } from "@/server/prisma"
import { TrackerType, User } from "@prisma/client"



export type LeaderboardParams = {
  trackerType: TrackerType
  trackerIds?: string[]
}
/**
 * fetches all games with the status COMPLETED from the db by TrackerType and tracker ids (optional)
 * 
 * @param params trackerType: TrackerType, trackerIds?: string []
 * @returns Array of completed games
 */
export async function getCompletedGames(params: LeaderboardParams) {
  const { trackerType, trackerIds } = params

  return await prisma.game.findMany({
    where: {
      tracker: {
        type: trackerType,
        ...(
          trackerIds // fetch only 
            ? {}
            : { id: { in: trackerIds } }
        )
      },
      status: "COMPLETED"
    },
    include: {
      rounds: true,
      participants: {
        include: {
          user: {
            select: {
              id: true,
              displayUsername: true,
              image: true,
              name: true
            }
          }
        }
      }
    }
  })
}

//? NonNullable<Prisma.PromiseReturnType<typeof getCompletedGames>[number]["participants"][number]["user"]>
type LeaderboardEntryUserType = Pick<User, "id" | "displayUsername" | "image" | "name">

export type LeaderboardEntryType = {
  user: LeaderboardEntryUserType
  placing: number
  metricValue: string
}
/**
 * 
 * provisional function to calculate win rate of players by all trackers
 * 
 * @returns Array of leaderboard entries
 */
export async function getLeaderboard(params: LeaderboardParams) {
  const games = await getCompletedGames(params);

  const leaderboard: LeaderboardEntryType[] = []
  const uniqueUsers = new Map() // count of appearances & wins
  const mappedOutput = [];

  //* STEP 1 - count appearance & wins
  for (const game of games) {
    if (game.gameData.type !== "SCHWIMMEN") continue;

    //? GameParticipant id of winner
    const winnerId = game.gameData.winner;

    // collect appearance and win count for every user
    for (const participant of game.participants) {

      const userId = participant.userId
      if (!userId) continue; // only evaluate participants who are users

      if (uniqueUsers.has(userId)) {
        // increment the appearance count and eventually win count
        uniqueUsers.get(userId).appearance++
        if (winnerId === participant.id) uniqueUsers.get(userId).wins++
      } else {
        uniqueUsers.set(userId, {
          appearance: 1, // directly set to 1
          wins: winnerId === participant.id ? 1 : 0, // 1 if initial appearce is also a win,
          user: participant.user
        })
      }

    }

  }


  //* STEP 2 - calculate metricValue 
  for (const mapEntry of uniqueUsers.values()) {
    const user = mapEntry.user
    // const metricValue = Number.parseFloat((mapEntry.wins / mapEntry.appearance).toFixed(4)) // appearance will never be 0, because the user would not appear in uniqueUsers if it had 0 appearances
    const metricValue = mapEntry.wins // appearance will never be 0, because the user would not appear in uniqueUsers if it had 0 appearances

    mappedOutput.push({ user, metricValue })
  }


  //* STEP 3 - sort by metricValue
  mappedOutput.sort((a, b) => {
    return b.metricValue - a.metricValue
  })


  //* STEP 4 - calculate placing & build return array
  mappedOutput.reduce((reduceState, mappedEntry, idx) => {
    // save metricValues
    const prevMetricValue = reduceState.prevMetricValue
    const thisMetricValue = mappedEntry.metricValue
    // compare prev and this metrc value
    if (thisMetricValue === prevMetricValue) {
      reduceState.offset++ // increase offset if placing is equal
    } else {
      // else reset offset count and set new metricValue for next comparison
      reduceState.offset = 0
      reduceState.prevMetricValue = thisMetricValue
    }

    leaderboard.push({
      user: mappedEntry.user,
      // metricValue: `${thisMetricValue * 100}%`,
      metricValue: String(thisMetricValue),
      placing: (idx + 1) - reduceState.offset
    })

    return reduceState
  }, {
    offset: 0,
    prevMetricValue: 0
  })

  return leaderboard
}


/**
 * LeaderboardCalcInterface.ts z.13 -> TODO: think of a more general structure
 * 
 * TODO: split current code into logical functions to abstract leaderboard calculation
 * -> Calc Classes should be a collection of functions used in getLeaderboard to do the necessary calculations decoupled from implementation logic
 */
