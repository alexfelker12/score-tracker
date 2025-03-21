//* react/next
import { headers } from "next/headers";

//* lib
import { auth } from "@/lib/auth";

//* local
import { AuthenticatedUser, UnAuthenticatedUser } from "./user-dropdowns";


export const User = async () => {
  // here get user and display informations and auth state, etc...
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) return <UnAuthenticatedUser />

  return <AuthenticatedUser session={session} />
}
