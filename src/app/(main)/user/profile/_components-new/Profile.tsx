"use client";

import { use, useState } from "react";

import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import { getUserDataById } from "@/server/actions/user/profile/actions";

import { auth } from "@/lib/auth";


import { PencilIcon, PencilOffIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemHeader, ItemMedia, ItemSeparator } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

import ProfileContext from "./ProfileContext";
import { ProfileImage } from "./ProfileImage";
import { ProfileUsername } from "./ProfileUsername";


export type ProfileProps = {
  session: typeof auth.$Infer.Session
  dataPromise: ReturnType<typeof getUserDataById>
}
export const Profile = ({ session, dataPromise }: ProfileProps) => {
  const queryKey = ["user", session.user.id, "profile"]
  const updateKey = [...queryKey, "update"]

  const [isEditing, setIsEditing] = useState<boolean>(false)

  // const router = useRouter()

  //* fetch user data - prefetched on server
  const { data: { data: initialUser }, isPending: isQueryPending, isFetching } = useSuspenseQuery({
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
  // const successfulUpdate: UseUpdateUserProps["onSuccess"] = () => {
  //   // notify user that the profile has been updated successfully
  //   toast.success("Your profile was successfully updated")

  //   // refresh the page to reload newest image for user dropdown
  //   router.refresh()
  //   refetch()

  //   setIsEditing(false)
  // }

  const [username, setUsername] = useState<string>(initialUser?.displayUsername || initialUser?.name || "")

  const buttonsDisabled = isUpdatePending || isQueryPending || isFetching
  const toggleEditing = () => setIsEditing(prev => !prev)
  const setNewUsername = (newUsername: string) => {
    setUsername(newUsername)
  }

  if (initialUser) return (
    <ProfileContext.Provider
      value={{
        user: initialUser,
        isEditing: isEditing,
        toggleEditing: toggleEditing,
        buttonsDisabled: buttonsDisabled,
        username: username,
        setNewUsername: setNewUsername
      }}
    >
      <Item
        variant="outline"
        className="relative"
      >

        <ItemHeader className="justify-center">
          <ItemMedia variant="image" className="relative rounded-full overflow-visible size-24">
            <ProfileImage />
          </ItemMedia>
        </ItemHeader>

        <ItemSeparator />

        <ItemContent>
          <ProfileUsername />
        </ItemContent>

        <ItemActions className="-top-3 -right-1.5 absolute">
          <AnimatePresence>
            {isEditing &&
              <Button
                className="z-10 rounded-full"
                onClick={toggleEditing}
                size="icon"
                variant="outline"
                disabled={buttonsDisabled}
                asChild
              >
                <motion.button
                  initial={{ x: 48, opacity: 0 }}
                  animate={{ x: 0, opacity: 100 }}
                  exit={{ x: 48, opacity: 0 }}
                  transition={{ bounce: false }}
                >
                  <PencilOffIcon />
                </motion.button>
              </Button>
            }
          </AnimatePresence>
          <Button
            className="z-20 rounded-full"
            onClick={toggleEditing}
            disabled={buttonsDisabled}
            size="icon"
            variant={isEditing ? "secondary" : "default"}
          >
            {isUpdatePending
              ? <Spinner />
              : isEditing
                ? <SaveIcon />
                : <PencilIcon />
            }
          </Button>
        </ItemActions>

      </Item>
    </ProfileContext.Provider >
  );
}
