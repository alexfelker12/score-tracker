import { create } from "zustand"
import { persist } from "zustand/middleware"

type SchwimmenMetaState = {
  meta: {
    showDealer: boolean
    hideDead: boolean
    uiSize: number[]
    isAdjustingSize: boolean
  }
}

type SchwimmenMetaActions = {
  setShowDealer: (show: boolean) => void
  setHideDead: (hide: boolean) => void
  setUiSize: (size: number[]) => void
  setIsAdjustingSize: (isAdjusting: boolean) => void
}

export type SchwimmenMetaStore = SchwimmenMetaState & SchwimmenMetaActions

export const useSchwimmenMetaStore = create<SchwimmenMetaStore>()(
  persist(
    (set) => ({
      meta: {
        showDealer: true,
        hideDead: false,
        uiSize: [1],
        isAdjustingSize: false
      },
      //* meta actions
      setShowDealer: (show) => set((state) => ({
        meta: {
          ...state.meta,
          showDealer: show
        }
      })),
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
      })),
      setIsAdjustingSize: (isAdjusting) => set((state) => ({
        meta: {
          ...state.meta,
          isAdjustingSize: isAdjusting
        }
      })),
    }),
    { name: "schwimmen-meta" }
  )
)