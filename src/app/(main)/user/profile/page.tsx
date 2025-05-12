import { Breadcrumbs } from "@/components/breadcrumbs";
import { Profile } from "./_components/profile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserDataById } from "@/server/actions/user/profile/actions";

export default async function UserProfile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) return (
    <main className="flex flex-col space-y-4 h-full">
      <Breadcrumbs />

      <div>
        {/* heading + description */}
        <h1 className="text-2xl">Your profile</h1>
        <p className="text-muted-foreground text-sm"></p>
      </div>

      <Suspense fallback={<Loading />}>
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

const Loading = () => {
  return (
    <div>
      <Skeleton className="w-full h-9" />
    </div>
  );
}
