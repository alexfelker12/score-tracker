import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signOut, signUp, useSession, updateUser, getSession } = createAuthClient({
  plugins: [
    usernameClient()
  ]
})
