"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { caching, prisma } from "@/server/prisma"
import { Prisma, Tracker, TrackerName } from "@prisma/client/edge"



//*** GET
//* trackers by creator
async function findTrackersByCreator(trackerName: TrackerName, userId: string) {
  const queryArgs: Prisma.TrackerFindManyArgs = {
    where: {
      id: userId,
      name: trackerName,
      archived: false
    },
    orderBy: {
      createdAt: "desc"
    },
    ...caching
  }

  return await prisma.tracker.findMany(queryArgs)
}
export type FindTrackersByCreatorReturn = Prisma.PromiseReturnType<typeof findTrackersByCreator>
export type FindTrackersByCreatorArgs = Parameters<typeof findTrackersByCreator>

export async function getAllTrackersByCreator(...args: FindTrackersByCreatorArgs) {
  const { data, error } = await tryCatch<FindTrackersByCreatorReturn>(
    findTrackersByCreator(...args)
  )

  if (error) return { error }

  return { data }
}

//* all trackers where player is participant and not creator
async function findTrackersForParticipant(trackerName: TrackerName, userId: string) {
  const queryArgs: Prisma.TrackerFindManyArgs = {
    where: {
      name: trackerName,
      archived: false,
      creatorId: {
        not: userId
      },
      players: {
        some: {
          playerId: userId
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    ...caching
  }

  return await prisma.tracker.findMany(queryArgs)
}
export type FindTrackersForParticipantReturn = Prisma.PromiseReturnType<typeof findTrackersForParticipant>
export type FindTrackersForParticipantArgs = Parameters<typeof findTrackersForParticipant>

export async function getAllTrackersForParticipant(...args: FindTrackersForParticipantArgs) {
  const { data, error } = await tryCatch<FindTrackersForParticipantReturn>(
    findTrackersForParticipant(...args)
  )

  if (error) return { error }

  return { data }
}

//* archived trackers
async function findArchivedTrackersForCreator(trackerName: TrackerName, userId: string) {
  const queryArgs: Prisma.TrackerFindManyArgs = {
    where: {
      name: trackerName,
      archived: true,
      creatorId: userId
    },
    orderBy: {
      createdAt: "desc"
    },
    ...caching
  }

  return await prisma.tracker.findMany(queryArgs)
}
export type FindArchivedTrackersForCreatorReturn = Prisma.PromiseReturnType<typeof findArchivedTrackersForCreator>
export type FindArchivedTrackersForCreatorArgs = Parameters<typeof findArchivedTrackersForCreator>

export async function getAllArchivedTrackersForCreator(...args: FindArchivedTrackersForCreatorArgs) {
  const { data, error } = await tryCatch<FindArchivedTrackersForCreatorReturn>(
    findArchivedTrackersForCreator(...args)
  )

  if (error) return { error }

  return { data }
}

//* single tracker
async function findTrackerById(trackerId: string) {
  const queryArgs: Prisma.TrackerFindUniqueArgs = {
    where: {
      id: trackerId
    },
    ...caching
  }

  return await prisma.tracker.findUnique(queryArgs)
}
export type FindTrackerByIdReturn = Prisma.PromiseReturnType<typeof findTrackerById>
export type FindTrackerByIdArgs = Parameters<typeof findTrackerById>

export async function getTrackerById(...args: FindTrackerByIdArgs) {
  const { data, error } = await tryCatch<FindTrackerByIdReturn>(
    findTrackerById(...args)
  )

  if (error) return { error }

  return { data }
}


//*** POST
//* create tracker
async function createSingleTracker(
  trackerName: TrackerName,
  displayName: string,
  userId: string,
  players: {
    guest: boolean
    idOrName: string
  }[]
) {
  const createArgs: Prisma.TrackerCreateArgs = {
    data: {
      name: trackerName,
      displayName,
      creator: {
        connect: {
          id: userId
        }
      },
      players: {
        createMany: {
          data: players.map((player) => (player.guest ? {
            name: player.idOrName,
          } : {
            playerId: player.idOrName
          }))
        }
      }
    }
  }

  return await prisma.tracker.create(createArgs)
}
export type CreateSingleTrackerReturn = Prisma.PromiseReturnType<typeof createSingleTracker>
export type CreateSingleTrackerArgs = Parameters<typeof createSingleTracker>

export async function createTracker(...args: CreateSingleTrackerArgs) {
  const { data, error } = await tryCatch<CreateSingleTrackerReturn>(
    createSingleTracker(...args)
  )

  if (error) return { error }

  return { data }
}


//*** PUT
//* update tracker archived state
// ... next todo
//* update tracker name
// ... 
//* update tracker players
// ... 

//*** DELETE
//* delete tracker
async function deleteSingleTracker(trackerId: string) {
  const deleteArgs: Prisma.TrackerDeleteArgs = {
    where: {
      id: trackerId
    }
  }

  return await prisma.tracker.delete(deleteArgs)
}
export type DeleteSingleTrackerReturn = Prisma.PromiseReturnType<typeof deleteSingleTracker>
export type DeleteSingleTrackerArgs = Parameters<typeof deleteSingleTracker>

export async function deleteTrackerById(...args: DeleteSingleTrackerArgs) {
  const { data, error } = await tryCatch<DeleteSingleTrackerReturn>(
    deleteSingleTracker(...args)
  )

  if (error) return { error }

  return { data }
}
