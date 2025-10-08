"use client";

import { MailIcon } from "lucide-react";
import { useProfileContext } from "./ProfileContext";
import { Input } from "@/components/ui/input";


export const ProfileUsername = () => {
  const { user, isEditing, username, setNewUsername } = useProfileContext()
  return (
    <>
      <span className="font-bold text-xl">
        {isEditing
          ? <Input
            value={username}
            onInput={(e) => setNewUsername(e.currentTarget.value)}
            className="-mx-[5px] px-1 py-0.5 h-7 text-xl align-middle"
          />
          :
          <span>{username}</span>
        }
      </span>

      <span className="flex items-center gap-1.5 text-muted-foreground">
        <MailIcon className="size-4" /> {user.email}
      </span>
    </>
  );
}
