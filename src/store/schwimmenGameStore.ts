import { OrderedPlayer } from "@/lib/ordered-player"
import { Game, GameParticipant, GameRound, User } from "@prisma/client"
import { SchwimmenRound } from "prisma/json_types/types"
import { create } from "zustand"

export enum ActionStatus {
  ISSUBTRACT,
  ISNUKE,
  ISIDLE
}

export type GameParticipantWithUser = GameParticipant & { user: User | null }
export type Round = Omit<GameRound, "data"> & { data: SchwimmenRound }

type SchwimmenGameState = {
  ready: boolean
  game: Game
  rounds: Round[]
  latestSyncedRounds: Round[]
  players: GameParticipantWithUser[]
  action: ActionStatus
  currentRoundNumber: number
  prevRoundNumber: number
  lastPlayersHit: string[]
}

type SchwimmenGameActions = {
  init: (gameState: Partial<SchwimmenGameState>) => void

  getPlayer: (id: string) => GameParticipantWithUser | undefined

  setAction: (action: ActionStatus) => void
  isAction: (action: ActionStatus) => boolean

  getRound: (roundNumber: number) => Round | undefined
  getCurrentRound: () => Round | undefined
  getLatestRound: () => Round
  setPrevRoundNumber: (roundNumber: number) => void
  setCurrentRoundNumber: (roundNumber: number) => void
  resetRounds: () => void
  setRounds: (rounds: Round[]) => void
  setLatestSyncedRounds: (rounds: Round[]) => void
  addRound: (data: Round["data"]) => Round[] | undefined
  subtractLifeOf: (playerId: string) => [Round["data"] | undefined, string[]]
  detonateNuke: (playerId: string, survivorId?: string) => [Round["data"] | undefined, string[]]
  setLastPlayersHit: (playerIds: string[]) => void

  getCurrentDealer: () => string | undefined
  getPrevDealer: () => string | undefined
  getNextDealerFromRoundData: (roundPlayers: SchwimmenRound["players"]) => string

  checkNukeForConflict: (detonatorId: string) => GameParticipantWithUser[] | undefined
  checkWinCondition: () => GameParticipantWithUser | undefined
  checkWinConditionForGameData: (data: Round["data"]) => GameParticipantWithUser | undefined

  finishGame: (newStatus: Exclude<Game["status"], "ACTIVE">) => void
}

export type SchwimmenGameStore = SchwimmenGameState & SchwimmenGameActions

export const useSchwimmenGameStore = create<SchwimmenGameStore>((set, get) => ({
  //* state
  ready: false,
  //* type cast: game.tsx only gets rendered when there is a game, therefore game will always be set on init 
  game: {} as Game,
  rounds: [],
  latestSyncedRounds: [],
  players: [],
  action: ActionStatus.ISIDLE,
  currentRoundNumber: 0,
  prevRoundNumber: 0,
  lastPlayersHit: [],

  init: (params) => set({ ...params }),

  //* players
  getPlayer: (id) => get().players.find((player) => id === player.id),

  //* actions
  setAction: (action) => set({ action }),
  isAction: (action) => get().action === action,

  //* rounds
  getRound: (roundNumber) => get().rounds.find((round) => round.round === roundNumber),
  getCurrentRound: () => get().getRound(get().currentRoundNumber),
  getLatestRound: () => get().rounds.reduce((prev, current) => (prev && prev.round > current.round) ? prev : current),
  setPrevRoundNumber: (roundNumber) => set({ prevRoundNumber: roundNumber || 0 }),
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
  setRounds: (rounds) => set({ rounds }),
  setLatestSyncedRounds: (rounds) => set({ latestSyncedRounds: rounds }),
  addRound: (data) => {
    const state = get()
    if (state.game.status !== "ACTIVE") return;

    const prevRounds = state.rounds.filter((round) => round.round <= state.currentRoundNumber)

    const updated: Partial<SchwimmenGameState> = {
      rounds: [
        ...prevRounds,
        {
          gameId: state.game.id,
          round: state.currentRoundNumber + 1,
          data
        }
      ],
      currentRoundNumber: state.currentRoundNumber + 1,
      prevRoundNumber: state.currentRoundNumber
    }

    set(updated)

    return updated.rounds
  },
  subtractLifeOf: (playerId) => {
    const state = get()
    if (state.game.status !== "ACTIVE") return [undefined, []];
    const playersHit: string[] = []
    const thisRound = state.getCurrentRound()

    if (!thisRound) return [undefined, []]

    const playersThisRound = thisRound.data.players
    const getPlayerFromRound = playersThisRound.find((player) => player.id === playerId)!

    const newRoundState: SchwimmenRound = {
      type: "SCHWIMMEN",
      playerSwimming: thisRound.data.playerSwimming,
      players: [],
      dealer: ""
    }

    //* continue only if player is not dead yet
    if (getPlayerFromRound.lifes > 0) {

      newRoundState.players = playersThisRound.map((player) => {
        if (player.id !== playerId) return player;

        //* check if a player is swimming
        if (thisRound.data.playerSwimming || player.lifes > 1) {

          //* push player hit by last action
          playersHit.push(player.id)

          return {
            ...player,
            lifes: player.lifes - 1,
          }
        } else {
          newRoundState.playerSwimming = player.id
          return player
        }
      })

      newRoundState.dealer = state.getNextDealerFromRoundData(newRoundState.players)

      state.setLastPlayersHit(playersHit)
      return [newRoundState, playersHit]
    } else return [undefined, []]
  },
  detonateNuke: (detonatorId, survivorId) => {
    const state = get()
    if (state.game.status !== "ACTIVE") return [undefined, []];
    const playersHit: string[] = []
    const thisRound = state.getCurrentRound()

    if (!thisRound) return [undefined, []]

    const playersThisRound = thisRound.data.players
    const getPlayerFromRound = playersThisRound.find((player) => player.id === detonatorId)!

    const newRoundState: SchwimmenRound = {
      type: "SCHWIMMEN",
      playerSwimming: thisRound.data.playerSwimming,
      players: [],
      nukeBy: detonatorId,
      dealer: ""
    }

    //* continue only if player is not dead yet
    if (getPlayerFromRound.lifes > 0) {
      newRoundState.players = playersThisRound.map((player) => {
        if (player.id === detonatorId || player.lifes < 1) return player;

        if (survivorId && player.id === survivorId) {
          //* set survivor as swimming before returning as is
          newRoundState.playerSwimming = survivorId
          return player
        }

        //* push player hit by last action
        playersHit.push(player.id)

        //* detonateNuke always gets called without conflict, because conflict gets checked beforehand -> safely can subtract lifes
        return {
          ...player,
          lifes: player.lifes - 1,
        }
      })

      newRoundState.dealer = state.getNextDealerFromRoundData(newRoundState.players)

      state.setLastPlayersHit(playersHit)
      return [newRoundState, playersHit]
    } else return [undefined, []]
  },
  setLastPlayersHit: (playerIds) => set({ lastPlayersHit: playerIds }),

  //* dealer
  getCurrentDealer: () => {
    const currentRound = get().getCurrentRound()
    if (!currentRound) return;
    return currentRound.data.dealer
  },
  getPrevDealer: () => {
    const prevRound = get().getRound(get().prevRoundNumber)
    if (!prevRound) return;
    return prevRound.data.dealer
  },
  getNextDealerFromRoundData: (roundPlayers) => {
    const state = get()
    //* first: create list of orderPlayers
    const orderedPlayers = roundPlayers.map(player => new OrderedPlayer(player))

    //* second: set references by index
    for (let i = 0; i < orderedPlayers.length; i++) {
      const nextIndex = (i + 1) % orderedPlayers.length // wrap around
      orderedPlayers[i].setNextPlayer(orderedPlayers[nextIndex])
    }

    const currentRound = state.getCurrentRound()
    if (!currentRound) return ""

    const currentDealer = orderedPlayers.find((player) => player.getJsonPlayer().id === currentRound.data.dealer)
    const nextPlayer = currentDealer?.getNextPlayer()?.returnIfAlive()?.getJsonPlayer().id

    return nextPlayer || ""
  },

  //* checks
  checkNukeForConflict: (playerId) => {
    const thisRound = get().getCurrentRound()
    const players = get().players

    if (!thisRound) return undefined

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
  checkWinCondition: () => {
    const playersAlive = get().getLatestRound().data.players.filter((player) => player.lifes > 0)

    if (playersAlive.length !== 1) return;

    return get().getPlayer(playersAlive[0].id)
  },
  checkWinConditionForGameData: (data) => {
    const playersAlive = data.players.filter((player) => player.lifes > 0)
    if (playersAlive.length === 1) return get().getPlayer(playersAlive[0].id); // 0 exists because length === 1 check is true
  },

  //* post finish
  finishGame: (newStatus) => set((state) => ({
    game: {
      ...state.game,
      status: newStatus
    }
  })),
}))
