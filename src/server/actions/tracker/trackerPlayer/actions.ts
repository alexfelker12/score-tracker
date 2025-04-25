"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma, User } from "@prisma/client/edge"



//*** POST
//* create trackerPlayer (add to tracker)
async function addTrackerPlayer(params: {
  userId: string
  trackerId: string
  playerOrGuest: {
    displayName: string
    player?: User
  }
}) {
  const { userId, trackerId, playerOrGuest } = params

  const player = {
    ...(playerOrGuest.player
      ? {
        connect: {
          id: playerOrGuest.player.id,
        },
      }
      : {}),
  }

  const createdTrackerPlayer = await prisma.trackerPlayer.create({
    data: {
      tracker: {
        connect: {
          id: trackerId,
          creatorId: userId
        }
      },
      displayName: playerOrGuest.player
        ? (playerOrGuest.player.displayUsername || playerOrGuest.player.name)
        : playerOrGuest.displayName,
      player
    }
  })

  console.log(createdTrackerPlayer)

  return createdTrackerPlayer
}
export type AddTrackerPlayerReturn = Prisma.PromiseReturnType<typeof addTrackerPlayer>
export type AddTrackerPlayerArgs = Parameters<typeof addTrackerPlayer>

export async function addPlayerToTracker(...args: AddTrackerPlayerArgs) {
  const { data, error } = await tryCatch<AddTrackerPlayerReturn>(
    addTrackerPlayer(...args)
  )

  console.log(data)

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error)

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
  userId: string
}) {
  const { trackerPlayerId, userId } = params
  return await prisma.trackerPlayer.delete({
    where: {
      id: trackerPlayerId,
      tracker: {
        creatorId: userId
      }
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
