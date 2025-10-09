"use client";

import { use } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserDataById } from "@/server/actions/user/profile/actions";

import { auth } from "@/lib/auth";

import { ProfileForm } from "./ProfileForm";
import { ProfileSkeleton } from "./ProfileSkeleton";


export type ProfileProps = {
  session: typeof auth.$Infer.Session
  dataPromise: ReturnType<typeof getUserDataById>
}
export const Profile = ({ session, dataPromise }: ProfileProps) => {
  const queryKey = ["user", session.user.id, "profile"]

  //* fetch user data - prefetched on server
  const { data: { data: user }, isFetching } = useSuspenseQuery({
    initialData: use(dataPromise),
    queryFn: () => getUserDataById({ userId: session.user.id }),
    queryKey, refetchOnMount: false, refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 // 1 hour
  });

  if (isFetching) return <ProfileSkeleton />
  if (user) return <ProfileForm user={user} queryKey={queryKey} />
}
