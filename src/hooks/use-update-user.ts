import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { tryCatch } from "@/server/helpers/try-catch";

import { updateUser } from "@/lib/auth-client";


export type UseUpdateUserProps = {
  userId: string
  onSuccess: () => void
}
export type UseUpdateUserFuncProps = {
  username: string
  image?: string
}

export const useUpdateUser = ({ userId, onSuccess }: UseUpdateUserProps) => {
  const handleUpdateError = (errorCode: string | undefined) => {
    switch (errorCode) {
      case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
        toast.error("Error while updating profile", {
          description: "Username is already taken. Please try another"
        })
        break;
      case "USERNAME_IS_INVALID":
        toast.error("Error while updating profile", {
          description: "Username contains invalid characters. Only numbers, letters, underscores and points are allowed"
        })
        break;
      default:
        toast.error("Error while updating profile", {
          description: "Please try again later"
        })
    }
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["user", userId, "profile", "update"],
    mutationFn: async (newProps: Partial<UseUpdateUserFuncProps>) => {
      const { data, error } = await tryCatch(updateUser({ ...newProps }))
      if (error) return { error }
      return { data }
    },
    onSettled: (res,) => {
      const data = res?.data
      if (data && data.data) {
        onSuccess()
      } else if (data && data.error) {
        handleUpdateError(data.error.code)
      }
    },
  });

  return { updateUser: mutate, isUpdatePending: isPending }
}
