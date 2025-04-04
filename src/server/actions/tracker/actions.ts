"use server"

import { participantsSchemaBase } from "@/schema/participants"
import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma, TrackerName } from "@prisma/client/edge"
import { z } from "zod"



//*** GET
//* trackers by creator
async function findTrackersByCreator(trackerName: TrackerName, userId: string) {
  return await prisma.tracker.findMany({
    where: {
      creatorId: userId,
      name: trackerName,
      archived: false
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
          players: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
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
  return await prisma.tracker.findMany({
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
    include: {
      creator: {
        select: {
          displayUsername: true,
          name: true
        }
      },
      _count: {
        select: {
          players: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
export type FindTrackersForParticipantReturn = Prisma.PromiseReturnType<typeof findTrackersForParticipant>
export type FindTrackersForParticipantArgs = Parameters<typeof findTrackersForParticipant>

export async function getAllTrackersAsParticipant(...args: FindTrackersForParticipantArgs) {
  const { data, error } = await tryCatch<FindTrackersForParticipantReturn>(
    findTrackersForParticipant(...args)
  )

  if (error) return { error }

  return { data }
}

//* archived trackers
async function findArchivedTrackersForCreator(trackerName: TrackerName, userId: string) {
  return await prisma.tracker.findMany({
    where: {
      name: trackerName,
      archived: true,
      creatorId: userId
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
          players: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
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
  return await prisma.tracker.findUnique({
    where: {
      id: trackerId
    },
    include: {
      players: true,
      games: true
    }
  })
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
async function createSingleTracker(params: {
  trackerName: TrackerName,
  displayName: string,
  creatorId: string,
  players: z.infer<typeof participantsSchemaBase.shape.players>
}) {
  const { trackerName, displayName, creatorId, players } = params

  return await prisma.tracker.create({
    data: {
      name: trackerName,
      displayName,
      creator: {
        connect: {
          id: creatorId
        }
      },
      players: {
        createMany: {
          data: players.map((player) => (player.guest ? {
            name: player.name,
          } : {
            playerId: player.user.id,
            name: player.user.displayUsername || player.user.name
          }))
        }
      }
    }
  })
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
