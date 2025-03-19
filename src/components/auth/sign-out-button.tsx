"use client"

import { useRouter } from "next/navigation"

import { signOut } from "@/lib/auth-client"

import { LogOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"


export type SignOutButtonProps = {
  signedIn: boolean
}

export const SignOutButton = ({ signedIn }: SignOutButtonProps) => {
  const router = useRouter()

  if (!signedIn) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      onClick={() => {
        signOut({
          fetchOptions: {
            // ctx: SuccessContext
            onSuccess: () => {
              router.push("/sign-in")
            },
          }
        })
      }}
    >
      <LogOutIcon /> Sign out
    </Button>
  )
}