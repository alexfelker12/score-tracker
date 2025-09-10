"use server"

import { getLeaderboardCalcClass } from "@/server/helpers/get-leaderboard-calc-class"
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

      },
      ...(
        trackerIds // fetch only 
          ? { trackerId: { in: trackerIds } }
          : {}
      ),
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
export type LeaderboardEntryUserType = Pick<User, "id" | "displayUsername" | "image" | "name">

export type LeaderboardEntryType = {
  user: LeaderboardEntryUserType
  placing: number
  metricValue: string
}

export type GetLeaderboardParams = LeaderboardParams & { metric: string, sortBy?: "ASC" | "DESC" }
/**
 * Wrapper function using calc classes to build the leaderboard array
 * 
 * @returns Array of leaderboard entries
 */
export async function getLeaderboard(params: GetLeaderboardParams) {
  const { trackerType, trackerIds, metric, sortBy = "DESC" } = params

  const games = await getCompletedGames({ trackerType, trackerIds });
  const calc = getLeaderboardCalcClass(params.trackerType, metric)
  if (!calc) return [];

  const leaderboard: LeaderboardEntryType[] = []

  //* STEP 1 - collect metric values
  for (const game of games) {
    // collect appearance and win count for every user
    calc.collectMetricValue({ game })
  }

  //* STEP 2 - calculate metric value 
  const mappedOutput = calc.calculateMetricValue()

  //* STEP 3 - sort by metric value
  if (sortBy === "ASC") {
    mappedOutput.sort((a, b) => {
      return a.metricValue - b.metricValue
    })
  } else {
    mappedOutput.sort((a, b) => {
      return b.metricValue - a.metricValue
    })
  }

  //* STEP 4 - calculate placing & build return array
  mappedOutput.reduce((reduceState, mappedEntry, idx) => {
    // save metric values
    const prevMetricValue = reduceState.prevMetricValue
    const thisMetricValue = mappedEntry.metricValue
    // compare prev and this metric value
    if (thisMetricValue === prevMetricValue) {
      reduceState.offset++ // increase offset if placing is equal
    } else {
      // else reset offset count and set new metric value for next comparison
      reduceState.offset = 0
      reduceState.prevMetricValue = thisMetricValue
    }

    leaderboard.push({
      user: mappedEntry.user,
      metricValue: calc.formatMetricValue(thisMetricValue),
      placing: (idx + 1) - reduceState.offset
    })

    return reduceState
  }, {
    offset: 0,
    prevMetricValue: 0
  })

  return leaderboard
}
