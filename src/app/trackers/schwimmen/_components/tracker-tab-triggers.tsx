"use client"

import { TabsTrigger } from "@/components/ui/tabs";
import { setCookie } from "cookies-next/client";
import React from "react";

type TrackerTabTriggerProps = {
  cookieKey: string
}

export const TrackerTabTrigger = ({ cookieKey, children, value, ...props }: React.ComponentPropsWithoutRef<typeof TabsTrigger> & TrackerTabTriggerProps) => {
  return (
    <TabsTrigger
      value={value}
      onClick={() => setCookie(cookieKey, value)}
      {...props}
    >
      {children}
    </TabsTrigger>
  );
}