"use client"

import { Suspense } from 'react';

import { useSession } from "@/lib/auth-client";

import { ChevronDownIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

//* local
import { AuthenticatedUser, UnAuthenticatedUser } from "./user-dropdowns";


export const User = () => {
  // here get user and display informations and auth state, etc...
  const { data: session, isPending } = useSession()

  if (isPending) (
    <div className="flex items-center gap-1 p-1 translate-x-1">
      <ChevronDownIcon className="size-4 shrink-0" />
      <Skeleton className="rounded-full size-9" />
    </div>
  )

  if (!session) return <UnAuthenticatedUser />

  return <AuthenticatedUser session={session} />
}
