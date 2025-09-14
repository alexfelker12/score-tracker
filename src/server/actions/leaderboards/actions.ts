"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { Prisma, TrackerType } from "@prisma/client"
import { getLeaderboard } from "./functions"
import { prisma } from "@/server/prisma"



//*** GET
//* leaderboard by trackertype

export type FetchLeaderboardByTrackerTypeReturn = Prisma.PromiseReturnType<typeof getLeaderboard>
export type FetchLeaderboardByTrackerTypeArgs = Parameters<typeof getLeaderboard>

export async function getLeaderboardByTrackerType(...args: FetchLeaderboardByTrackerTypeArgs) {
  const { data, error } = await tryCatch<FetchLeaderboardByTrackerTypeReturn>(
    getLeaderboard(...args)
  )

  if (error) return { error }

  return { data }
}


//* all trackers where player is participant
async function findTrackersForLeaderboard(trackerType: TrackerType) {
  return await prisma.tracker.findMany({
    where: {
      type: trackerType,
      archived: false,
    },
    include: {
      creator: {
        select: {
          displayUsername: true,
          name: true
        }
      },
      _count: {
        select: {
          players: true,
          games: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
export type FindTrackersForLeaderboardReturn = Prisma.PromiseReturnType<typeof findTrackersForLeaderboard>
export type FindTrackersForLeaderboardArgs = Parameters<typeof findTrackersForLeaderboard>

export async function getAllTrackersForLeaderboard(...args: FindTrackersForLeaderboardArgs) {
  const { data, error } = await tryCatch<FindTrackersForLeaderboardReturn>(
    findTrackersForLeaderboard(...args)
  )

  if (error) return { error }

  return { data }
}
