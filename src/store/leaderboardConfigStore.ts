import { create } from "zustand"
import { persist } from "zustand/middleware"

// TODO: currently Boilerplate code to avoid lint rules -> implement

type LeaderboardFilterState = {
  a: number
}

type LeaderboardFilterActions = {
  setA: (newA: number) => void
}

export type LeaderboardFilterStore = LeaderboardFilterState & LeaderboardFilterActions
export const useLeaderboardFilterStore = create<LeaderboardFilterStore>()(
  persist(
    (set) => ({
      // ...
      a: 0,
      // setA: (newA) => set((state) => ({
      setA: (newA) => set({
        a: newA
      }),
    }),
    { name: "leaderboard-config" }
  )
)
