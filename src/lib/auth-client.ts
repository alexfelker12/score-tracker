import { auth } from "@/lib/auth"
import { PromiseReturnType } from "@prisma/client/extension"
import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"

export const { signIn, signOut, signUp, useSession } = createAuthClient({
  plugins: [
    usernameClient()
  ]
})

export const isAuthenticated = (session: PromiseReturnType<typeof auth.api.getSession>) => session && session.user
