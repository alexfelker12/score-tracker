import { User } from "@prisma/client";
import { createContext, use } from "react";


const ProfileContext = createContext<{
  user: User
  disabled: boolean
  isEditing: boolean

  // image
  croppedImage: string | undefined
  setCroppedImage: (image: string | undefined) => void
  deleteImage: boolean
  setDeleteImage: (del: boolean) => void
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
