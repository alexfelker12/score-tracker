"use server"

import { participantsSchema } from "@/schema/participants"
import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma, TrackerType } from "@prisma/client/edge"
import { z } from "zod"



//*** GET
//* trackers by creator
async function findTrackersByCreator(trackerType: TrackerType, userId: string) {
  return await prisma.tracker.findMany({
    where: {
      creatorId: userId,
      type: trackerType,
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
async function findTrackersAsParticipant(trackerType: TrackerType, userId: string) {
  return await prisma.tracker.findMany({
    where: {
      type: trackerType,
      archived: false,
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
export type FindTrackersAsParticipantReturn = Prisma.PromiseReturnType<typeof findTrackersAsParticipant>
export type FindTrackersAsParticipantArgs = Parameters<typeof findTrackersAsParticipant>

export async function getAllTrackersAsParticipant(...args: FindTrackersAsParticipantArgs) {
  const { data, error } = await tryCatch<FindTrackersAsParticipantReturn>(
    findTrackersAsParticipant(...args)
  )

  if (error) return { error }

  return { data }
}

//* archived trackers
async function findArchivedTrackersForCreator(trackerType: TrackerType, userId: string) {
  return await prisma.tracker.findMany({
    where: {
      type: trackerType,
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
      players: {
        include: {
          player: true
        }
      },
      games: {
        select: {
          id: true,
          createdAt: true,
          tracker: {
            select: {
              id: true,
              displayName: true
            }
          },
          status: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      creator: true
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
  trackerType: TrackerType,
  displayName: string,
  creatorId: string,
  players: z.infer<typeof participantsSchema.shape.players>
}) {
  const { trackerType, displayName, creatorId, players } = params

  return await prisma.tracker.create({
    data: {
      type: trackerType,
      displayName,
      creator: {
        connect: {
          id: creatorId
        }
      },
      players: {
        createMany: {
          data: players.map((player) => (player.guest ? {
            displayName: player.name,
          } : {
            displayName: player.user.displayUsername || player.user.name,
            playerId: player.user.id
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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //* unique constraint failed

    const prismaError = {
      meta: error.meta,
      code: error.code
    }

    return { error: prismaError }
  }

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
