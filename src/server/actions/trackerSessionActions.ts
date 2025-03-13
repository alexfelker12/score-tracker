"use server"

import { prisma } from "@/server/prisma"
import { Prisma } from "@prisma/client/edge"

// export type GetTrackerSessionsType = {
//   id: Tracker["id"]
// }

// export async function getTrackerSessions({ id }: GetTrackerSessionsType) {
//   try {
//     const trackerSessions = await prisma.trackerSession.findMany({
//       where: {
//         trackerId: id
//       }
//     })

//     return { data: trackerSessions }
//   } catch (error) {
//     return { error: error }
//   }
// }

//* POST create trackerSession
async function createSession(createSessionArgs: Prisma.TrackerSessionCreateArgs) {
  return await prisma.trackerSession.create(createSessionArgs)
}
export type CreateTrackerSessionReturnType = Prisma.PromiseReturnType<typeof createSession>
export async function createTrackerSession(createSessionArgs: Prisma.TrackerSessionCreateArgs) {
  try {
    const data = await createSession(createSessionArgs)
    return { data }
  } catch (error) { return { error } }
}
