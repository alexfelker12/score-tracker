"use client";


import { useMutationState } from "@tanstack/react-query";
import { ProfileWrapperProps } from "../page";
import { ProfileDefaultView } from "./profile-default-view";
import { ProfileEditView } from "./profile-edit-view";


export const Profile = (params: ProfileWrapperProps) => {
  const { session } = params;

  const isUpdatePending = useMutationState({
    filters: { mutationKey: ["user", session.user.id, "profile", "update"], status: "pending" },
    select: (mutation) => mutation.state.status === "pending",
  }).some((pending) => pending);

  return (
    <div className={isUpdatePending ? "opacity-50" : ""}>
      <ProfileDefaultView {...params} />
      <ProfileEditView {...params} />
    </div>
  );
}