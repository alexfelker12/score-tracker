"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Game, Prisma } from "@prisma/client"


//*** GET
//* single tracker
async function findGameById(gameId: string) {
  return await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      tracker: true,
      participants: {
        include: {
          user: true
        },
        orderBy: {
          order: {
            sort: "asc"
          }
        }
      },
      rounds: true
    },
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
type playerIdWithOrder = {
  playerId: string
  order: number
}
const getPlayerOrder = (playerId: string, players: playerIdWithOrder[]) => {
  return players.find((player) => player.playerId === playerId)?.order
    || players.map((player) => player.playerId).indexOf(playerId)
}
async function createGameWithParticipants(params: {
  trackerId: string
  players: playerIdWithOrder[]
}) {
  const { trackerId, players } = params

  const trackerPlayers = await prisma.trackerPlayer.findMany({
    where: {
      id: { in: players.map((player) => player.playerId) }
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
            userId: trackerPlayer.playerId,
            order: getPlayerOrder(trackerPlayer.id, players)
          } : {
            displayName: trackerPlayer.displayName,
            order: getPlayerOrder(trackerPlayer.id, players)
          }))
        }
      },
      gameData: {
        type: "SCHWIMMEN",
        swimming: "",
        winner: "",
        winByNuke: false
      }
    },
    include: {
      tracker: true,
      participants: {
        orderBy: {
          order: {
            sort: "asc"
          }
        }
      }
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


//*** PUT
//* update game status
async function updateGameById(params: {
  gameId: string
  newStatus: Game["status"]
  gameData?: Game["gameData"]
}) {
  const { gameId, newStatus, gameData } = params

  return await prisma.game.update({
    where: {
      id: gameId,
      status: "ACTIVE"
    },
    data: {
      status: newStatus,
      gameData
    }
  })
}
export type UpdateGameStatusReturn = Prisma.PromiseReturnType<typeof updateGameById>
export type UpdateGameStatusArgs = Parameters<typeof updateGameById>

export async function updateGameStatusAndData(...args: UpdateGameStatusArgs) {
  const { data, error } = await tryCatch<UpdateGameStatusReturn>(
    updateGameById(...args)
  )
  if (error) {
    console.log(error)
    return { error }
  }
  return { data }
}
