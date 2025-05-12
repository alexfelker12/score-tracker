"use client";

import React from "react";

import { useMutation } from "@tanstack/react-query";


import { updateUser } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getQueryClient } from "@/lib/get-query-client";
import { tryCatch } from "@/server/helpers/try-catch";
import { toast } from "sonner";
import { ProfileWrapperProps } from "../page";


export const ProfileEditView = (params: ProfileWrapperProps) => {
  const { session } = params;
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const qc = getQueryClient()

  const { mutate: updateUserData, isPending: isUpdatePending } = useMutation({
    mutationKey: ["user", session.user.id, "profile", "update"],
    mutationFn: async (newUsername: string) => {
      const { data, error } = await tryCatch(
        updateUser({
          username: newUsername,
          // image: newImageUrl, // Uncomment when adding image update
        })
      )
      if (error) return { error }
      return { data }
    },
    onSettled: (res) => {
      const data = res?.data
      if (data && data.data) {
        if (usernameRef.current) usernameRef.current.value = "";
        // refetch();
        qc.invalidateQueries({ queryKey: ["user", session.user.id, "profile"] })
      } else if (data && data.error) {
        switch (data.error.code) {
          case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
            toast.error("Error while updating user data", {
              description: "Username is already taken. Please try another"
            })
            break;
          case "USERNAME_IS_INVALID":
            toast.error("Error while updating user data", {
              description: "Username contains invalid characters. Only numbers, letters and underscores are allowed"
            })
            break;
          default:
            console.log(data.error.message)
        }
      }
    },
  });

  const handleUpdateClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newUsername = usernameRef.current?.value;
    if (!newUsername) return;

    updateUserData(newUsername);
  };

  return (
    <div className="mt-4">
      <p>Update data:</p>
      <p className="text-muted-foreground text-sm">username</p>
      <form className="flex justify-between gap-4 w-full" onSubmit={handleUpdateClick}>
        <Input ref={usernameRef} />
        <Button
          type="submit"
          disabled={isUpdatePending}
        >
          {isUpdatePending ? "Updating..." : "Update username"}
        </Button>
      </form>
    </div>
  );
}