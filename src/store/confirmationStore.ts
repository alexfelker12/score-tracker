import { GameParticipant } from '@prisma/client';
import { create } from 'zustand';

// Zentraler Store für den Confirmation-Status
interface ConfirmationStore {
  isOpen: boolean
  data: GameParticipant[]
  resolver: ((value: GameParticipant) => void) | null
  openConfirmation: (data?: GameParticipant[]) => Promise<GameParticipant>
  confirm: (survivingPlayer: GameParticipant) => GameParticipant
}

export const useConfirmationStore = create<ConfirmationStore>((set, get) => ({
  isOpen: false,
  data: [],
  resolver: null,
  openConfirmation: (data = []) => {
    return new Promise<GameParticipant>((resolve) => {
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
  }
}))
