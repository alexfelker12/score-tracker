"use client";

import { User } from "@prisma/client";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { base64ToFile, validateUsername } from "@/lib/utils";

import { useUpdateUser } from "@/hooks/use-update-user";
import { useUploadImage } from "@/hooks/use-upload-image";

import { PencilIcon, PencilOffIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemHeader, ItemMedia, ItemSeparator } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

import ProfileContext from "./ProfileContext";
import { ProfileEmail } from "./ProfileEmail";
import { ProfileImage } from "./ProfileImage";
import { ProfileUsername } from "./ProfileUsername";


type ProfileFormProps = React.ComponentProps<"form"> & {
  user: User
  queryKey?: string[]
}
export const ProfileForm = ({ user, queryKey }: ProfileFormProps) => {
  const router = useRouter()
  const qc = useQueryClient()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<string>();
  const [deleteImage, setDeleteImage] = useState<boolean>(false);


  //* react to update change
  const successfulUpdate = () => {
    // notify user that the profile has been updated successfully
    toast.success("Your profile was successfully updated")

    // refresh the page to reload newest image for user dropdown
    router.refresh()
    qc.invalidateQueries({ queryKey })

    setIsEditing(false)
  }

  //* hooks to change user data
  const { uploadImage, isUploading } = useUploadImage({
    userId: user.id,
  })
  const { updateUser, isUpdatePending } = useUpdateUser({
    userId: user.id,
    onSuccess: successfulUpdate
  })

  //* profile query state
  const isFetchingProfile = useIsFetching({ queryKey }) > 0
  const disabled = isUpdatePending || isFetchingProfile || isUploading


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUpdatePending || isUploading) return

    const formData = new FormData(e.currentTarget)
    const newUsername = formData.get("newUsername") as string

    //* only handle update when username is valid
    if (validateUsername(newUsername).valid) handleUpdate({
      newProfileImage: croppedImage,
      newUsername
    })
  }

  const handleUpdate = async ({
    newUsername,
    newProfileImage
  }: {
    newUsername: string
    newProfileImage: string | undefined
  }) => {
    try {
      //* upload image if provided
      let imageUrl: string | null = ""
      if (newProfileImage) {
        const imageFile = await base64ToFile(newProfileImage)
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          toast.error("Failed to upload image. Please try again.")
          return
        }
      }

      if (user.displayUsername !== newUsername || (imageUrl || deleteImage)) {
        updateUser({
          ...(user.displayUsername !== newUsername ? { username: newUsername } : {}),
          ...(imageUrl || deleteImage ? { image: imageUrl } : {})
        })
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        user, disabled, isEditing,
        croppedImage, setCroppedImage,
        deleteImage, setDeleteImage
      }}
    >
      <form
        onSubmit={handleSubmit}
        action="#"
      >
        <Item
          variant="outline"
          className="relative"
        >
          {/* accessability - item actions at first because visually they appear at top */}
          <ItemActions className="-top-3 -right-1.5 absolute">
            <AnimatePresence>
              {isEditing &&
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  size="icon"
                  variant="outline"
                  disabled={disabled}
                  className="z-10 rounded-full"
                  asChild
                >
                  <motion.button
                    initial={{ x: 48, opacity: 0 }}
                    animate={{ x: 0, opacity: 100 }}
                    exit={{ x: 48, opacity: 0 }}
                    transition={{ bounce: false }}
                  >
                    <PencilOffIcon className="size-4" />
                  </motion.button>
                </Button>
              }
            </AnimatePresence>
            <Button
              type="submit"
              onClick={(e) => {
                if (isEditing) return; // submit functionality when editing
                e.preventDefault() // prevent submit behaviour to toggle edit mode
                setIsEditing(true)
              }}
              disabled={disabled}
              size="icon"
              variant="default"
              className="z-20 rounded-full transition-colors"
            >
              {isUploading || isUpdatePending
                ? <Spinner className="size-5" />
                : isEditing
                  ? <SaveIcon />
                  : <PencilIcon />
              }
            </Button>
          </ItemActions>

          <ItemHeader className="justify-center">
            <ItemMedia variant="image" className="relative rounded-full overflow-visible size-24">
              <ProfileImage />
              {/* <Example /> */}
            </ItemMedia>
          </ItemHeader>

          <ItemSeparator />

          <ItemContent>
            <ProfileUsername />
            <ProfileEmail />
          </ItemContent>

        </Item>
      </form>
    </ProfileContext.Provider>
  );
}
