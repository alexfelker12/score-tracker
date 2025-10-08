"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2Icon, UploadIcon, UserIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useProfileContext } from "./ProfileContext";

import { motion } from "motion/react";


type ProfileImageProps = React.ComponentProps<typeof Avatar>
export const ProfileImage = ({ className }: ProfileImageProps) => {
  const { user, isEditing, buttonsDisabled, toggleEditing } = useProfileContext()

  return (
    <>
      <Avatar className={cn("z-20 size-full", className)}>
        <AvatarImage src={user.image || undefined} alt={user.displayUsername || "User"} />
        {!user.image && <AvatarFallback><UserIcon className="size-1/2" /></AvatarFallback>}
      </Avatar>
      <AnimatePresence>
        {isEditing &&
          <div className="-left-10 z-10 absolute flex flex-col gap-y-1">

            {/* remove image */}
            <motion.button
              // animation
              initial={{ x: 72, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 100 }}
              exit={{ x: 72, y: 20, opacity: 0 }}
              transition={{ bounce: false }}
              // base
              onClick={() => toggleEditing}
              className={cn(buttonVariants({ size: "icon", variant: "destructive" }),
                "rounded-full"
              )}
              disabled={buttonsDisabled || !user.image}
            >
              <Trash2Icon />
            </motion.button>

            {/* upload new image */}
            <motion.button
              // animation
              initial={{ x: 72, y: -20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 100 }}
              exit={{ x: 72, y: -20, opacity: 0 }}
              transition={{ bounce: false }}
              // base
              onClick={() => toggleEditing}
              className={cn(buttonVariants({ size: "icon" }),
                "rounded-full"
              )}
              disabled={buttonsDisabled}
            >
              <UploadIcon />
            </motion.button>

          </div>
        }
      </AnimatePresence>
    </>
  );
}
