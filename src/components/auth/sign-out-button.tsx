"use client"

//* react/next
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"

//* packages
import { Slot } from "@radix-ui/react-slot"
import { toast } from "sonner"

//* lib
import { signOut } from "@/lib/auth-client"

//* components
import { AuthenticatedUserProps } from "@/components/layout/header/user"
import { Button } from "@/components/ui/button"


export type SignOutButtonProps = AuthenticatedUserProps & {
  asChild?: boolean
  children?: ReactNode
}
export const SignOutButton = ({ session, asChild, children }: SignOutButtonProps) => {
  const router = useRouter()
  const Comp = asChild ? Slot : Button

  // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        // ctx: SuccessContext
        onSuccess: () => {
          toast.success("You have signed out successfully")
          router.push("/sign-in")
        },
      }
    })
  }

  if (session) return (
    <Comp
      onClick={handleSignOut}
    >
      {children}
    </Comp>
  )
}