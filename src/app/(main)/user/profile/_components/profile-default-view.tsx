"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MailIcon, UserIcon } from "lucide-react";
import { ProfileViewProps } from "./profile";

export const ProfileDefaultView = ({ userData }: ProfileViewProps) => {
  return (
    <div className="flex md:flex-row flex-col items-center md:items-start md:space-x-6 space-y-4 md:space-y-0">
      <Avatar className="size-24">
        <AvatarImage src={userData.image || undefined} alt={userData.displayUsername || "User"} />
        {!userData.image && <AvatarFallback><UserIcon className="size-12" /></AvatarFallback>}
      </Avatar>

      <div className="space-y-1 text-center md:text-left">
        <h2 className="font-bold text-xl">
          {userData.displayUsername || "Anonymous User"}
        </h2>
        <span className="flex items-center gap-2 text-muted-foreground">
          <MailIcon className="size-4" /> {userData.email}
        </span>
      </div>
    </div>
  );
};