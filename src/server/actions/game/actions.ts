"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma } from "@prisma/client"


//*** GET
//* single tracker
async function findGameById(gameId: string) {
  return await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      tracker: true,
      participants: true,
      gameData: true,
      rounds: true
    }
  })
}
export type FindGameByIdReturn = Prisma.PromiseReturnType<typeof findGameById>
export type FindGameByIdArgs = Parameters<typeof findGameById>

export async function getGameById(...args: FindGameByIdArgs) {
  const { data, error } = await tryCatch<FindGameByIdReturn>(
    findGameById(...args)
  )

  if (error) return { error }

  return { data }
}


//*** POST
//* create game
async function createGameWithParticipants(params: {
  trackerId: string
  playerIds: string[]
}) {
  const { trackerId, playerIds } = params

  const trackerPlayers = await prisma.trackerPlayer.findMany({
    where: {
      id: { in: playerIds }
    },
    include: {
      player: true
    }
  })

  const newGame = await prisma.game.create({
    data: {
      tracker: {
        connect: {
          id: trackerId
        }
      },
      participants: {
        createMany: {
          data: trackerPlayers.map((trackerPlayer) => (trackerPlayer.player ? {
            displayName: trackerPlayer.player.displayUsername || trackerPlayer.player.name,
            userId: trackerPlayer.playerId
          } : {
            displayName: trackerPlayer.displayName
          }))
        }
      },
      gameData: {
        create: {
          data: {
            type: "SCHWIMMEN",
            swimming: "",
            winner: "",
            winByNuke: false
          }
        }
      }
    },
    include: {
      tracker: true,
      participants: true
    }
  })

  //* set default round (round 0) for initial state
  await prisma.gameRound.create({
    data: {
      round: 0,
      data: {
        type: "SCHWIMMEN",
        players: newGame.participants.map((participant) => ({
          id: participant.id,
          lifes: 3
        })),
        playerSwimming: undefined
      },
      game: {
        connect: {
          id: newGame.id
        }
      }
    }
  })

  return newGame
}
export type CreateGameReturn = Prisma.PromiseReturnType<typeof createGameWithParticipants>
export type CreateGameArgs = Parameters<typeof createGameWithParticipants>

export async function createGame(...args: CreateGameArgs) {
  const { data, error } = await tryCatch<CreateGameReturn>(
    createGameWithParticipants(...args)
  )
  if (error) {
    console.log(error)
    return { error }
  }
  return { data }
}
