"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma } from "@prisma/client"
import { SchwimmenRound } from "prisma/json_types/types"


//*** POST
//* create latest round
async function createRoundForGame(params: {
  gameId: string
  roundNumber: number
  data: SchwimmenRound
}) {
  const { gameId, roundNumber, data } = params

  return await prisma.gameRound.create({
    data: {
      game: {
        connect: {
          status: "ACTIVE",
          id: gameId
        }
      },
      round: roundNumber,
      data
    }
  })
}
export type CreateRoundForGameReturn = Prisma.PromiseReturnType<typeof createRoundForGame>
export type CreateRoundForGameArgs = Parameters<typeof createRoundForGame>

export async function createLatestRoundForGame(...args: CreateRoundForGameArgs) {
  const { data, error } = await tryCatch<CreateRoundForGameReturn>(
    createRoundForGame(...args)
  )
  if (error) {
    console.log(error)
    return { error }
  }
  return { data }
}

//*** DELETE
//* delete rounds from round number
async function deleteRounds(params: {
  gameId: string
  roundNumber: number
}) {
  const { gameId, roundNumber } = params

  return await prisma.gameRound.deleteMany({
    where: {
      gameId,
      round: {
        gt: roundNumber
      },
      game: {
        status: "ACTIVE"
      }
    }
  })
}
export type DeleteRoundsReturn = Prisma.PromiseReturnType<typeof deleteRounds>
export type DeleteRoundsArgs = Parameters<typeof deleteRounds>

export async function deleteRoundsFromRoundNumber(...args: DeleteRoundsArgs) {
  const { data, error } = await tryCatch<DeleteRoundsReturn>(
    deleteRounds(...args)
  )

  if (error) return { error }

  return { data }
}
