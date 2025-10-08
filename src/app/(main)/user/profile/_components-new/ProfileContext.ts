import { User } from "@prisma/client";
import { createContext, use } from "react";


const ProfileContext = createContext<{
  user: User
  buttonsDisabled: boolean
  isEditing: boolean
  toggleEditing: () => void
  username: string
  setNewUsername: (newUsername: string) => void
} | null>(null)

export function useProfileContext() {
  const context = use(ProfileContext)
  if (!context) {
    throw new Error(
      "Component must be used inside Profile"
    )
  }
  return context
}

export default ProfileContext
