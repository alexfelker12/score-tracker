"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma, User } from "@prisma/client/edge"



//*** POST
//* create trackerPlayer (add to tracker)
async function addTrackerPlayer(params: {
  // userId: string
  trackerId: string
  playerOrGuest: {
    displayName: string
    player?: User
  }
}) {
  const { trackerId, playerOrGuest } = params

  const player = {
    ...(playerOrGuest.player
      ? {
        connect: {
          id: playerOrGuest.player.id,
        },
      }
      : {}),
  }

  return await prisma.trackerPlayer.create({
    data: {
      tracker: {
        connect: {
          id: trackerId,
          // creatorId: userId
        }
      },
      displayName: playerOrGuest.player
        ? (playerOrGuest.player.displayUsername || playerOrGuest.player.name)
        : playerOrGuest.displayName,
      player
    }
  })
}
export type AddTrackerPlayerReturn = Prisma.PromiseReturnType<typeof addTrackerPlayer>
export type AddTrackerPlayerArgs = Parameters<typeof addTrackerPlayer>

export async function addPlayerToTracker(...args: AddTrackerPlayerArgs) {
  const { data, error } = await tryCatch<AddTrackerPlayerReturn>(
    addTrackerPlayer(...args)
  )

  if (error instanceof Prisma.PrismaClientKnownRequestError) {

    //* unique constraint failed
    return {
      error: {
        meta: error.meta,
        code: error.code
      }
    }
  }

  return { data }
}


//*** DELETE
//* delete trackerPlayer
async function deleteTrackerPlayer(params: {
  trackerPlayerId: string
  userIdIfPlayer: string | undefined
}) {
  const { trackerPlayerId, userIdIfPlayer } = params
  return await prisma.trackerPlayer.delete({
    where: {
      id: trackerPlayerId,
      ...(
        userIdIfPlayer ? {
          tracker: {
            creatorId: {
              not: userIdIfPlayer
            }
          }
        } : {}
      )
    }
  })
}
export type DeleteTrackerReturnPlayer = Prisma.PromiseReturnType<typeof deleteTrackerPlayer>
export type DeleteTrackerArgsPlayer = Parameters<typeof deleteTrackerPlayer>

export async function deleteTrackerPlayerById(...args: DeleteTrackerArgsPlayer) {
  const { data, error } = await tryCatch<DeleteTrackerReturnPlayer>(
    deleteTrackerPlayer(...args)
  )

  if (error) return { error }

  return { data }
}
