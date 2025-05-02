// import { GameParticipantWithUser } from '@prisma/client';
import { create } from 'zustand';
import { GameParticipantWithUser } from './schwimmenGameStore';

// Zentraler Store für den Confirmation-Status
interface ConfirmationStore {
  isOpen: boolean
  data: GameParticipantWithUser[]
  resolver: ((value: GameParticipantWithUser) => void) | null
  openConfirmation: (data?: GameParticipantWithUser[]) => Promise<GameParticipantWithUser>
  confirm: (survivingPlayer: GameParticipantWithUser) => GameParticipantWithUser
}

export const useConfirmationStore = create<ConfirmationStore>((set, get) => ({
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
  }
}))
