"use client"

//* react/next
import Link from "next/link";
import { usePathname } from "next/navigation";

//* lib
import { auth } from "@/lib/auth";

//* icons
import { ChevronDownIcon, ContactIcon, LogInIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';

//* components
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


export const UnAuthenticatedUser = () => {
  const pathname = usePathname()
  //* only apply search params when not on home or auth pages
  const searchParams = pathname !== "/" && !pathname.startsWith("/sign-in") && !pathname.startsWith("/sign-up")
    ? "?" + new URLSearchParams({ from: pathname })
    : ""
  const signInWithFromUrl = `/sign-in${searchParams}`

  return (
    <DropdownMenu>
      {/* p-1 translate-x-1 */}
      <DropdownMenuTrigger className="relative flex items-center cursor-pointer [&[data-state=open]>svg]:-rotate-180">
        <ChevronDownIcon className="-left-5 absolute transition-transform duration-200 size-4 shrink-0" />
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
            <Link href={signInWithFromUrl}>
              <LogInIcon /> Sign in
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type AuthenticatedUserProps = {
  session: typeof auth.$Infer.Session
}
export const AuthenticatedUser = ({ session }: AuthenticatedUserProps) => {
  if (session) return (
    <DropdownMenu>
      {/* p-1 translate-x-1 */}
      {/* User icon button */}
      <DropdownMenuTrigger className="relative flex items-center cursor-pointer [&[data-state=open]>svg]:rotate-180">
        <ChevronDownIcon className="-left-5 absolute transition-transform duration-200 size-4 shrink-0" />
        <Avatar className="size-9">
          <AvatarImage src={session.user.image || undefined}></AvatarImage>
          <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        {/* user signature */}
        <DropdownMenuLabel>
          <span className="block leading-[1.1]">Hello, {session.user.displayUsername || session.user.name}!</span>
          <span className="text-muted-foreground text-xs">{session.user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* profile links */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user/profile">
              <ContactIcon /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user/settings">
              <SettingsIcon /> Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* sing out */}
        <SignOutButton session={session} asChild>
          <DropdownMenuItem>
            <LogOutIcon /> Sign out
          </DropdownMenuItem>
        </SignOutButton>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
