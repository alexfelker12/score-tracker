import { create } from "zustand"
import { persist } from "zustand/middleware"

type SchwimmenMetaState = {
  meta: {
    hideDead: boolean
    uiSize: number[]
  }
}

type SchwimmenMetaActions = {
  setHideDead: (hide: boolean) => void
  setUiSize: (size: number[]) => void
}

export type SchwimmenMetaStore = SchwimmenMetaState & SchwimmenMetaActions

export const useSchwimmenMetaStore = create<SchwimmenMetaStore>()(
  persist(
    (set) => ({
      meta: {
        hideDead: false,
        uiSize: [3]
      },
      //* meta actions
      setHideDead: (hide) => set((state) => ({
        meta: {
          ...state.meta,
          hideDead: hide
        }
      })),
      setUiSize: (size) => set((state) => ({
        meta: {
          ...state.meta,
          uiSize: size
        }
      }))
    }),
    { name: "schwimmen-meta" }
  )
)