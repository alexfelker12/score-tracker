import { SCHWIMMENLOCALSTORAGEBASEKEY } from "@/lib/constants"
import { participantsSchemaBase } from "@/schema/participants"
import { z } from "zod"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PlayerState = {
  id: number
  name: string
  lifes: number
}

type SchwimmenSessionState = {
  session: {
    players: PlayerState[]
    playerSwimming: number
  }
}

type SchwimmenSessionActions = {
  init: (playerData: z.infer<typeof participantsSchemaBase.shape.players>) => void
  subtractLifes: (playerIds: number[]) => void
  getSwimmingPlayer: () => PlayerState | undefined
  setSwimmingPlayer: (playerId: number) => void
  detonateNuke: (detonatorId: number) => PlayerState[] | void
}

export type SchwimmenSessionStore = SchwimmenSessionState & SchwimmenSessionActions

export const useSchwimmenSessionStore = create<SchwimmenSessionStore>()(
  persist(
    (set, get) => ({
      session: {
        //* all participating players
        players: [],
        //* rule: the first player which life count gets reduced to 0 will "swim" (one time save)
        //? playerSwimming -> id of swimming player
        playerSwimming: 0
      },
      //* init the session with player data and asign an index id and 3 lifes
      init: (playerData) => set({
        session: {
          players: playerData.map((player, idx) => ({
            id: idx + 1,
            name: player.name,
            lifes: 3
          })),
          playerSwimming: 0
        }
      }),
      //* players whose id is included in the passed array get a life subtracted (life - 1)
      subtractLifes: (playerIds) => set((state) => {
        const { players, playerSwimming } = state.session;

        //* save punished player depending on if a player is swimming or not
        const potentialSwimmingPlayer = playerIds.length === 1 && playerSwimming === 0
          ? players.find((player) => playerIds.includes(player.id))
          : null;

        const swimmingPlayer = potentialSwimmingPlayer && potentialSwimmingPlayer.lifes === 1
          //* if player has only one life remaining, he will swim 
          ? potentialSwimmingPlayer.id
          //* else if not or a player is already swimming, id stays the same
          : playerSwimming;

        //* create new state with swimming player information
        const newState = {
          session: {
            ...state.session,
            playerSwimming: swimmingPlayer
          }
        }

        //* if no potentially swimming player was found, subtract lifes accordingly
        if (!potentialSwimmingPlayer) {
          newState.session.players = players.map((player, idx) =>
            //* lifes cant go under 0
            playerIds.includes(idx) && player.lifes > 0
              ? { ...player, lifes: player.lifes - 1 }
              : player
          );
        }

        return newState
      }),
      getSwimmingPlayer: () => {
        const { players, playerSwimming } = get().session;
        return players.find((player) => player.id === playerSwimming)
      },
      setSwimmingPlayer: (playerId) => set((state) => ({
        session: {
          ...state.session,
          playerSwimming: playerId
        }
      })),
      //* detonating a "nuke" means every player except the player with the passed playerId loses a life (life - 1)
      detonateNuke: (detonatorId) => {
        const { players, playerSwimming } = get().session;
        //* nukedPlayers: contains all players except the detonator
        const nukedPlayers = players.filter((player) => player.id !== detonatorId)
        const playersWithOneLife = nukedPlayers.filter((player) => player.lifes === 1)

        if (playerSwimming !== 0 || playersWithOneLife.length <= 1) {
          //? condition: playerSwimming !== 0 
          //* if a player is swimming there can be no conflict between lifes
          //? condition: playersWithOneLife.length <= 1
          //* if there is only one player with 1 life there can also be no conflict

          return set((state) => ({
            session: {
              ...state.session,
              players: state.session.players.map((player) =>
                //* lifes cant go under 0
                player.lifes > 0 ? {
                  ...player,
                  lifes: player.lifes - 1
                } : player
              )
            }
          }))
        } else {
          //* ... else there is a conflict which needs to be manually resolved
          return playersWithOneLife
        }
      }
    }),
    { name: SCHWIMMENLOCALSTORAGEBASEKEY }
  )
)
