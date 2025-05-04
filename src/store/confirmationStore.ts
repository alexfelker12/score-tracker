import { create } from 'zustand';
import { GameParticipantWithUser } from './schwimmenGameStore';

interface NukeConfirmationStore {
  //* state
  isOpen: boolean
  data: GameParticipantWithUser[]

  //* actions
  resolver: ((value: GameParticipantWithUser) => void) | null
  openConfirmation: (data?: GameParticipantWithUser[]) => Promise<GameParticipantWithUser>
  confirm: (survivingPlayer: GameParticipantWithUser) => GameParticipantWithUser
}

export const useNukeConfirmationStore = create<NukeConfirmationStore>((set, get) => ({
  isOpen: false,
  data: [],
  resolver: null,
  openConfirmation: (data = []) => {
    return new Promise<GameParticipantWithUser>((resolve) => {
      set({ isOpen: true, data, resolver: resolve })
    })
  },
  confirm: (survivingPlayer) => {
    const { resolver } = get()
    if (resolver) {
      resolver(survivingPlayer)
      set({ isOpen: false, resolver: null })
    }
    return survivingPlayer
  },
}))


interface LastActionConfirmationStore {
  //* state
  isOpen: boolean
  data: GameParticipantWithUser | undefined

  //* actions
  resolver: ((value: boolean) => void) | null
  openConfirmation: (data?: GameParticipantWithUser) => Promise<boolean>
  confirm: () => void
  cancel: () => void
}

export const useLastActionConfirmationStore = create<LastActionConfirmationStore>((set, get) => ({
  isOpen: false,
  data: undefined,
  resolver: null,
  openConfirmation: (data) => {
    return new Promise<boolean>((resolve) => {
      set({ isOpen: true, data, resolver: resolve })
    })
  },
  confirm: () => {
    const { resolver } = get()
    if (resolver) {
      resolver(true)
      set({ isOpen: false, resolver: null })
    }
  },
  cancel: () => {
    const { resolver } = get()
    if (resolver) {
      resolver(false)
      set({ isOpen: false, resolver: null })
    }
  },
}))
