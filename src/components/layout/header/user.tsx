//* react/next
import { headers } from "next/headers";
import Link from "next/link";

//* lib
import { auth } from "@/lib/auth";

//* icons
import { ChevronUpIcon, ContactIcon, LogInIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';

//* components
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


export const User = async () => {
  // here get user and display informations and auth state, etc...
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) return (
    <UnAuthenticatedUser />
  )

  return (
    <AuthenticatedUser session={session} />
  );
}

export type AuthenticatedUserProps = {
  session: typeof auth.$Infer.Session
}
const AuthenticatedUser = ({ session }: AuthenticatedUserProps) => {
  if (session) return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 p-1 translate-x-1 cursor-pointer [&[data-state=open]>svg]:-rotate-180">
        <ChevronUpIcon className="transition-transform duration-200 size-4 shrink-0" />
        <Avatar className="size-9">
          <AvatarImage src={session.user.image || undefined}></AvatarImage>
          <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block leading-[1.1]">Hello, {session.user.displayUsername}!</span>
          <span className="text-muted-foreground text-xs">{session.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <ContactIcon /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/settings">
              <SettingsIcon /> Settings
            </Link>
          </DropdownMenuItem>
          <SignOutButton session={session} asChild>
            <DropdownMenuItem>
              <LogOutIcon /> Sign out
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UnAuthenticatedUser = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 p-1 translate-x-1 cursor-pointer [&[data-state=open]>svg]:-rotate-180">
        <ChevronUpIcon className="transition-transform duration-200 size-4 shrink-0" />
        <Avatar className="size-9">
          <AvatarImage></AvatarImage>
          <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block leading-[1.1]">Hello, user!</span>
          <span className="text-muted-foreground text-xs">Currently not signed in</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/sign-in">
              <LogInIcon /> Sign in
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
