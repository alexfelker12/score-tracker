import { create } from "zustand"
// import { persist } from "zustand/middleware"

type LeaderboardFilterState = {
  metric: string
  trackerIds: string[] | undefined
}

type LeaderboardFilterActions = {
  setMetric: (metric: string) => void
  setTrackerIds: (trackerIds: string[] | undefined) => void
}

export type LeaderboardFilterStore = LeaderboardFilterState & LeaderboardFilterActions
export const useLeaderboardFilterStore = create<LeaderboardFilterStore>()(
  // persist(
  (set) => ({
    
    // state
    metric: "total-wins",
    trackerIds: undefined,

    // setters
    setMetric: (metric) => set({ metric }),
    setTrackerIds: (trackerIds) => set({ trackerIds }),

  }),
  //   { name: "leaderboard-config" }
  // )
)
