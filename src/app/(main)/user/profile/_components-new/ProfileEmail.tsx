"use client";

import { MailIcon } from "lucide-react";

import { useProfileContext } from "./ProfileContext";


type ProfileEmailProps = React.ComponentProps<"span">
export const ProfileEmail = ({ }: ProfileEmailProps) => {
  const { user } = useProfileContext()

  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <MailIcon className="size-4" /> {user.email}
    </span>
  );
}
