"use client";

import { useRouter } from "next/navigation";
import React, { use } from "react";

import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { FindUserDataByIdReturn, getUserDataById } from "@/server/actions/user/profile/actions";

import { UseUpdateUserProps } from "@/hooks/use-update-user";

import { auth } from "@/lib/auth";

import { SquarePenIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ProfileDefaultView } from "./profile-default-view";
import { ProfileEditView } from "./profile-edit-view";


type ProfileProps = {
  session: typeof auth.$Infer.Session
  dataPromise: ReturnType<typeof getUserDataById>
}
export const Profile = (params: ProfileProps) => {
  const { session, dataPromise } = params;
  const queryKey = ["user", session.user.id, "profile"]
  const updateKey = [...queryKey, "update"]

  //* toggle profile view
  const [isEditing, setIsEditing] = React.useState<boolean>(false)

  const router = useRouter()

  //* fetch user data - prefetched on server
  // const { invalidateQueries } = getQueryClient()
  const { data: user, isPending: isQueryPending, isFetching, refetch } = useSuspenseQuery({
    initialData: use(dataPromise),
    queryFn: () => getUserDataById({ userId: session.user.id }),
    queryKey, refetchOnMount: false, refetchOnReconnect: false
  });

  //* hook into update pending status
  const isUpdatePending = useMutationState({
    filters: { mutationKey: updateKey, status: "pending" },
    select: (mutation) => mutation.state.status === "pending",
  }).some((pending) => pending)

  //* react to update change
  const successfulUpdate: UseUpdateUserProps["onSuccess"] = () => {
    // notify user that the profile has been updated successfully
    toast.success("Your profile was successfully updated")

    // refresh the page to reload newest image for user dropdown - only if profile picture was changed
    router.refresh()
    refetch()

    // return to default view mode
    setIsEditing(false)
  }

  return (
    <>
      <div className="flex justify-between w-full">
        <div>
          {/* heading + description */}
          <h1 className="font-bold text-2xl">Your profile</h1>
        </div>
        <Button
          className="transition-colors" variant="outline"
          onClick={() => { setIsEditing(!isEditing) }}
          disabled={isUpdatePending || isQueryPending || isFetching}
        >
          {isEditing ? <><XIcon /> <span>Cancel</span></> : <><SquarePenIcon /> <span>Edit</span></>}
        </Button>
      </div>

      {(isFetching || isQueryPending)
        ? <ProfileSkeleton />
        : user?.data && (isEditing
          ? <ProfileEditView userData={user.data} onSuccess={successfulUpdate} />
          : <ProfileDefaultView userData={user.data} />)
      }
    </>
  );
}

export type ProfileViewProps = {
  userData: FindUserDataByIdReturn
}

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Skeleton className="rounded-full size-24" />
      <div className="flex flex-col items-center space-y-1">
        <Skeleton className="w-20 h-7" />
        <Skeleton className="w-48 h-6" />
      </div>
    </div>
  )
}