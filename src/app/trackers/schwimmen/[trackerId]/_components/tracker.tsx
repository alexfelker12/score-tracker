"use client"

import { useSchwimmenSessionStore } from "@/store/schwimmenSessionStore";
import React from "react";
import { z } from "zod";
import { SCHWIMMENLOCALSTORAGEBASEKEY } from "@/lib/constants";
import { LoaderCircleIcon } from "lucide-react";
import { participantsSchemaBase } from "@/schema/participants";

export type TrackerType = {
  trackerData: z.infer<typeof participantsSchemaBase.shape.players>
  trackerId: string
}

export const Tracker = ({ trackerData, trackerId }: TrackerType) => {
  //* hooks here
  const trackerSession = useSchwimmenSessionStore();
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    if (trackerData) {
      // dynamic storage name
      useSchwimmenSessionStore.persist.setOptions({
        name: `schwimmen-tracker-${trackerId}`,
      })
      useSchwimmenSessionStore.persist.rehydrate()
      localStorage.removeItem(SCHWIMMENLOCALSTORAGEBASEKEY)

      setIsHydrated(useSchwimmenSessionStore.persist.hasHydrated())
      trackerSession.init(trackerData)
    }
  }, [trackerData])

  if (!isHydrated) return (
    <div className="flex justify-center items-center w-full h-full">
      <LoaderCircleIcon className="size-8" />
    </div>
  )

  return (
    <>
      {trackerSession.session.players.map((player) => (
        <p key={player.id}>{player.name}</p>
      ))}
    </>
  );
}
