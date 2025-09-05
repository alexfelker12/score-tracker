"use server"

import { prisma } from "@/server/prisma"
import { Prisma, TrackerType, User } from "@prisma/client"



export type TrackerQueryType = TrackerType | string[]
export async function getCompletedGames(params: {
  trackerQueryBy: TrackerQueryType
}) {
  const { trackerQueryBy } = params

  return await prisma.game.findMany({
    where: {
      tracker: {
        ...(
          //* variable is of type string when it is an enum, else it would be of type "object" (= array)
          typeof trackerQueryBy === "string"
            //* passed param is a TrackerType
            ? {
              type: trackerQueryBy as TrackerType
            }
            //* passed param is an array of tracker ids
            : {
              id: {
                in: trackerQueryBy as string[]
              }
            }
        )
      },
      //* only evaluate completed games
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

type LeaderboardEntry = {
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
export async function getLeaderboard() {
  const games = await getCompletedGames({ trackerQueryBy: "SCHWIMMEN" });

  const leaderboard: LeaderboardEntry[] = []
  const uniqueUsers = new Map() // count of appearances & wins

  //* STEP 1 - count appearance & wins
  for (const game of games) {
    if (game.gameData.type !== "SCHWIMMEN") continue;

    // determine winnerId - id of winner is the GameParticipant id -> save userId as winnerId on match
    let winnerId = "";
    for (const participant of game.participants) {
      if (game.gameData.winner === participant.id && participant.userId) winnerId = participant.userId
    }

    // collect appearance and win count for every user
    for (const participant of game.participants) {

      const userId = participant.userId
      if (!userId) continue; // only evaluate participants who are users

      if (uniqueUsers.has(userId)) {
        // increment the appearance count and eventually win count
        uniqueUsers.get(userId).appearance++
        if (winnerId === userId) uniqueUsers.get(userId).wins++
      } else {
        uniqueUsers.set(userId, {
          appearance: 1, // directly set to 1
          wins: winnerId === userId ? 1 : 0, // 1 if initial appearce is also a win,
          user: participant.user
        })
      }

    }

  }


  //* STEP 2 - map to return output
  const mappedOutput = [];
  for (const mapEntry of uniqueUsers.values()) {
    const user = mapEntry.user
    const metricValue = Number.parseFloat((mapEntry.wins / mapEntry.appearance).toFixed(2)) // appearance will never be 0, because the user would not appear in uniqueUsers if it had 0 appearances

    mappedOutput.push({ user, metricValue })
  }


  //* STEP 3 - sort by metricValue
  mappedOutput.sort((a, b) => {
    return b.metricValue - a.metricValue
  })


  //* STEP 4 - calculate placing
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
