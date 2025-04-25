import { Game, GameParticipant, GameRound, Prisma } from "@prisma/client"
import { SchwimmenRound } from "prisma/json_types/types"
import { create } from "zustand"

export enum ActionStatus {
  ISSUBTRACT,
  ISNUKE,
  ISIDLE
}


type Round = Omit<GameRound, "data"> & { data: SchwimmenRound }

type SchwimmenGameState = {
  ready: boolean
  game: Game
  rounds: Round[]
  players: GameParticipant[]
  action: ActionStatus
  currentRoundNumber: number
}

type SchwimmenGameActions = {
  init: (gameState: SchwimmenGameState) => void

  getPlayer: (id: string) => GameParticipant | undefined

  setAction: (action: ActionStatus) => void
  isAction: (action: ActionStatus) => boolean

  getRound: (roundNumber: number) => Round
  getCurrentRound: () => Round
  getLatestRound: () => Round
  setCurrentRoundNumber: (roundNumber: number) => void
  resetRounds: () => void
  addRound: (data: Round["data"]) => void
  subtractLifeOf: (playerId: string) => Round["data"] | undefined
  detonateNuke: (playerId: string, survivorId?: string) => Round["data"] | undefined

  checkNukeForConflict: (detonatorId: string) => GameParticipant[] | undefined
  checkWinCondition: (type?: "latest") => GameParticipant | undefined

  finishGame: (newStatus: Exclude<Game["status"], "ACTIVE">) => void
}

export type SchwimmenGameStore = SchwimmenGameState & SchwimmenGameActions

export const useSchwimmenGameStore = create<SchwimmenGameStore>((set, get) => ({
  //* state
  ready: false,
  //* type cast: game.tsx only gets rendered when there is a game, therefore game will always be set on init 
  game: {} as Game,
  rounds: [],
  players: [],
  action: ActionStatus.ISIDLE,
  currentRoundNumber: 0,

  init: (params) => set({ ...params }),

  //* players
  getPlayer: (id) => get().players.find((player) => id === player.id),

  //* actions
  setAction: (action) => set({ action }),
  isAction: (action) => get().action === action,

  //* rounds
  // at the end "!" because we know they exist
  getRound: (roundNumber) => get().rounds.find((round) => round.round === roundNumber)!,
  getCurrentRound: () => get().getRound(get().currentRoundNumber),
  getLatestRound: () => get().rounds.reduce((prev, current) => (prev && prev.round > current.round) ? prev : current),
  setCurrentRoundNumber: (roundNumber) => set({ currentRoundNumber: roundNumber || 0 }),
  resetRounds: () => {
    if (get().game.status !== "ACTIVE") return;
    set((state) => {
      const initialRound = state.rounds.filter((round) => round.round <= 0)
      return {
        rounds: [
          ...initialRound
        ]
      }
    })
  },
  addRound: (data) => {
    if (get().game.status !== "ACTIVE") return;
    set((state) => {
      const prevRounds = state.rounds.filter((round) => round.round <= state.currentRoundNumber)

      return {
        rounds: [
          ...prevRounds,
          {
            gameId: state.game.id,
            round: state.currentRoundNumber + 1,
            data
          }
        ],
        currentRoundNumber: state.currentRoundNumber + 1
      }
    })
  },
  subtractLifeOf: (playerId) => {
    if (get().game.status !== "ACTIVE") return;
    const thisRound = get().getCurrentRound()
    const playersThisRound = thisRound.data.players
    const getPlayerFromRound = playersThisRound.find((player) => player.id === playerId)!

    const newRoundState: SchwimmenRound = {
      type: "SCHWIMMEN",
      playerSwimming: thisRound.data.playerSwimming,
      players: []
    }

    //* continue only if player is not dead yet
    if (getPlayerFromRound.lifes <= 0) return;

    newRoundState.players = playersThisRound.map((player) => {
      if (player.id !== playerId) return player;

      //* check if a player is swimming
      if (thisRound.data.playerSwimming || player.lifes > 1) {
        return {
          id: player.id,
          lifes: player.lifes - 1
        }
      } else {
        newRoundState.playerSwimming = player.id
        return player
      }
    })

    return newRoundState
  },
  detonateNuke: (detonatorId, survivorId) => {
    if (get().game.status !== "ACTIVE") return;
    const thisRound = get().getCurrentRound()
    const playersThisRound = thisRound.data.players
    const getPlayerFromRound = playersThisRound.find((player) => player.id === detonatorId)!

    const newRoundState: SchwimmenRound = {
      type: "SCHWIMMEN",
      playerSwimming: thisRound.data.playerSwimming,
      players: [],
      nukeBy: detonatorId
    }

    //* continue only if player is not dead yet
    if (getPlayerFromRound.lifes <= 0) return;

    newRoundState.players = playersThisRound.map((player) => {
      if (player.id === detonatorId) return player;

      if (survivorId && player.id === survivorId) {
        //* set survivor as swimming before returning as is
        newRoundState.playerSwimming = survivorId
        return player
      }

      //* detonateNuke always gets called without conflict, because conflict gets checked beforehand -> safely can subtract lifes
      return {
        id: player.id,
        lifes: player.lifes - 1
      }
    })

    return newRoundState
  },

  //* checks
  checkNukeForConflict: (playerId) => {
    const thisRound = get().getCurrentRound()
    const players = get().players

    //* conflict can only happen, if no player is swimming
    if (!thisRound.data.playerSwimming) {
      const playersThisRound = thisRound.data.players

      //* filter out players who are not the detonator and have one life
      const playersWithOneLife = playersThisRound.filter((player) => player.id !== playerId && player.lifes <= 1).map((player) => player.id)

      //* if there are at least 2 players return those player per id matching else undefined
      if (playersWithOneLife.length > 0) {
        return players.filter((affectedPlayer) => playersWithOneLife.includes(affectedPlayer.id))
      } else {
        return undefined
      }
    }

    return undefined
  },
  checkWinCondition: (type) => {
    const currentRound = type === "latest" ? get().getCurrentRound() : get().getLatestRound()
    const playersAlive = currentRound.data.players.filter((player) => player.lifes > 0)

    if (playersAlive.length !== 1) return;

    return get().getPlayer(playersAlive[0].id)
  },

  //* post finish
  finishGame: (newStatus) => set((state) => ({
    game: {
      ...state.game,
      status: newStatus
    }
  })),
}))
