import { Game, GameParticipant, GameRound } from "@prisma/client"
import { SchwimmenGame, SchwimmenRound } from "prisma/json_types/types"
import { create } from "zustand"

export enum ActionStatus {
  ISSUBTRACT,
  ISNUKE,
  ISIDLE
}


type Round = Omit<GameRound, "data"> & { data: SchwimmenRound }

type SchwimmenGameState = {
  ready: boolean
  game: Game | null
  gameId: string,
  gameData: SchwimmenGame
  rounds: Round[]
  players: GameParticipant[]
  action: ActionStatus
  currentRoundNumber: number
}

// TODO: actions to set round data and a "finish game" action to set [general] game data
// ? TODO: actions to "go back" (ctrl+z) and "go forward" (ctrl+shift+z) ...
type SchwimmenGameActions = {
  init: (gameState: SchwimmenGameState) => void

  getPlayer: (id: string) => GameParticipant | undefined

  setAction: (action: ActionStatus) => void
  isAction: (action: ActionStatus) => boolean

  getRound: (roundNumber: number) => Round
  getCurrentRound: () => Round
  getLastRound: () => Round
  setCurrentRoundNumber: (roundNumber: number) => void
  addRound: (data: Round["data"]) => void
  subtractLifeOf: (playerId: string) => Round["data"] | undefined
}

export type SchwimmenGameStore = SchwimmenGameState & SchwimmenGameActions

export const useSchwimmenGameStore = create<SchwimmenGameStore>((set, get) => ({
  //* state
  ready: false,
  game: null,
  gameId: "",
  //TODO continue
  gameData: {
    type: "SCHWIMMEN",
    swimming: "",
    winner: "",
    winByNuke: false
  },
  rounds: [],
  players: [],
  action: ActionStatus.ISIDLE,
  currentRoundNumber: 0,

  //* actions
  init: (params) => set({ ...params }),

  getPlayer: (id) => get().players.find((player) => id === player.id),

  // 
  setAction: (action) => set({ action }),
  isAction: (action) => get().action === action,

  // rounds
  // at the end "!" because we know they exist
  getRound: (roundNumber) => get().rounds.find((round) => round.round === roundNumber)!,
  getCurrentRound: () => get().getRound(get().currentRoundNumber),
  getLastRound: () => get().rounds.reduce((prev, current) => (prev && prev.round > current.round) ? prev : current),
  setCurrentRoundNumber: (roundNumber) => set({ currentRoundNumber: roundNumber || 0 }),
  addRound: (data) => set((state) => {
    const prevRounds = state.rounds.filter((round) => round.round <= state.currentRoundNumber)
    const newRound: Round = {
      gameId: state.gameId,
      round: state.currentRoundNumber + 1,
      data
    }
    return {
      rounds: [
        ...prevRounds,
        newRound
      ],
      currentRoundNumber: state.currentRoundNumber + 1
    }
  }),
  subtractLifeOf: (playerId) => {
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
  }
}))
