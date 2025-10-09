import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getUserDataById } from "@/server/actions/user/profile/actions";

import { auth } from "@/lib/auth";

import { Breadcrumbs } from "@/components/breadcrumbs";

import { Profile } from "./_components-new/Profile";
import { ProfileSkeleton } from "./_components-new/ProfileSkeleton";


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
