import { Breadcrumbs } from "@/components/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/get-query-client";
import { getUserDataById } from "@/server/actions/user/profile/actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Profile, ProfileSkeleton } from "./_components/profile";

export default async function UserProfile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) return (
    <main className="flex flex-col space-y-4 h-full">
      <Breadcrumbs />

      <Suspense fallback={
        <>
          <div className="flex justify-between w-full">
            <div>
              {/* heading + description */}
              <h1 className="text-2xl">Your profile</h1>
            </div>
            <Skeleton className="w-20 h-9" />
          </div>
          <ProfileSkeleton />
        </>
      }>
        <ProfileWrapper session={session} />
      </Suspense>
    </main>
  );
}

export type ProfileWrapperProps = {
  session: typeof auth.$Infer.Session
}
async function ProfileWrapper(params: ProfileWrapperProps) {
  const { session } = params
  const qc = getQueryClient()
  await qc.prefetchQuery({
    queryKey: ["user", session.user.id, "profile"],
    queryFn: () => getUserDataById({ userId: session.user.id })
  })

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Profile {...params} />
    </HydrationBoundary>
  );
}
