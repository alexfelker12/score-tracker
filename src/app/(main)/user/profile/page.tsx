import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getUserDataById } from "@/server/actions/user/profile/actions";

import { auth } from "@/lib/auth";

import { Breadcrumbs } from "@/components/breadcrumbs";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Profile } from "./_components-new/Profile"


export default async function UserProfile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect("/sign-in")

  const dataPromise = getUserDataById({ userId: session.user.id })

  return (
    <main className="flex flex-col space-y-4 h-full">
      <Breadcrumbs />

      {/* heading */}
      <h1 className="font-bold text-2xl">Your profile</h1>

      <div className="relative">
        <Suspense fallback={<ProfileSkeleton />}>
          <Profile
            session={session}
            dataPromise={dataPromise}
          />
        </Suspense>
      </div>
    </main >
  );
}

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4 border rounded-md w-full">
      <Skeleton className="rounded-full size-24 self-center" />
      <Separator className="w-full" />
      <div className="space-y-3">
        <Skeleton className="mt-1 w-24 h-5" />
        <Skeleton className="w-44 h-3.5" />
      </div>
    </div>
  );
}