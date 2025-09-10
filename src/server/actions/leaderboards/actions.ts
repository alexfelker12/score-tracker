"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { Prisma } from "@prisma/client"
import { getLeaderboard, GetLeaderboardParams } from "./functions"



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
