"use client"

// packages
import React from "react";
import { z } from "zod";

// store
import { Player, useSchwimmenSessionStore } from "@/store/schwimmenSessionStore";

// schema
import { participantsSchemaBase } from "@/schema/participants";

// lib
import { SCHWIMMENLOCALSTORAGEBASEKEY } from "@/lib/constants";
import { cn } from "@/lib/utils";

// icons
import { HeartCrackIcon } from "lucide-react";

// components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RadioActiveIcon } from "@/components/icons/radioactive";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";

// local components
import { NukeDialogContent } from "./tracker-nuke-dialog";
import { ParticipantCard } from "./tracker-participant-card";
import { ResetSessionDialog } from "./tracker-reset-session-dialog";


export type TrackerType = {
  trackerData: z.infer<typeof participantsSchemaBase.shape.players>
  trackerId: string
}

export const Tracker = ({ trackerData, trackerId }: TrackerType) => {
  //* hooks here
  const trackerSession = useSchwimmenSessionStore();
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [openNukeDialog, setOpenNukeDialog] = React.useState<boolean>(false)
  const [toBeNukedPlayers, setToBeNukedPlayers] = React.useState<Player[]>([])

  React.useEffect(() => {
    if (trackerData) {
      hydrateSession(trackerData)
    }
  }, [trackerData])

  const hydrateSession = async (data: TrackerType["trackerData"]) => {
    //* dynamic storage name
    useSchwimmenSessionStore.persist.setOptions({
      name: `schwimmen-tracker-${trackerId}`,
    })
    await useSchwimmenSessionStore.persist.rehydrate()
    setIsHydrated(useSchwimmenSessionStore.persist.hasHydrated())

    //* remove base name from localStorage
    if (localStorage.getItem(SCHWIMMENLOCALSTORAGEBASEKEY)) localStorage.removeItem(SCHWIMMENLOCALSTORAGEBASEKEY);
    //* if no persisted session data, init with starting data
    if (!localStorage.getItem(`schwimmen-tracker-${trackerId}`)) trackerSession.init(data);
  }

  const handleDetonateNuke = (playerId: number) => {
    const conflictingPlayers = trackerSession.detonateNuke(playerId)

    if (conflictingPlayers) {
      setToBeNukedPlayers(conflictingPlayers)
      setOpenNukeDialog(true)
    }
  }

  const handleNuking = (nukedPlayers: number[], survivorId: number) => {
    //! order of manually handling player lifes after nuke:
    //* 1. set the swimming player before subtracting lifes of nuked players with subtractLifes
    trackerSession.setSwimmingPlayer(survivorId)

    //* 2. subtractLifes is handling subtracting lifes slightly differently depending on the amount of players passed to the function (1 / 2+). If two players are affected only one player will be passed to this function which will handle swimming for the losing player. Setting the swimming player beforehand will disable handling swimming by default
    trackerSession.subtractLifes(nukedPlayers)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4">

        {/* reset - dialog */}
        <ResetSessionDialog
          trackerData={trackerData}
          trackerSession={trackerSession}
          isInitializing={!isHydrated}
        />

        {/* text size slider */}
        <div className="flex flex-1 gap-2">
          {isHydrated ?
            <>
              <span className="text-sm leading-none">XS</span>
              <Slider
                min={0}
                max={4}
                value={[trackerSession.session.cardSize]}
                defaultValue={[trackerSession.session.cardSize]}
                onValueChange={(value) => trackerSession.setCardSize(value[0])}
                step={1}
              />
              <span className="text-sm leading-none">XL</span>
            </>
            :
            <Skeleton className="w-full h-3.5" />
          }
        </div>

      </div>

      {/* participants cards */}
      <div className="flex flex-col gap-4 w-full">
        {/* if is not hydrated (no loaded) yet, display loading skeletons */}
        {isHydrated ?
          trackerSession.session.players.map((player) => (
            <DropdownMenu key={player.id}>
              <DropdownMenuTrigger disabled={player.lifes === 0}>
                <ParticipantCard {...player} size={trackerSession.session.cardSize} playerSwimming={trackerSession.session.playerSwimming} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-2 w-fit">
                <DropdownMenuLabel className="text-lg">Actions for {player.name}</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => { trackerSession.subtractLifes([player.id]) }}
                  className={cn(
                    buttonVariants({
                      variant: "outline"
                    }),
                    "justify-between text-base",
                  )}
                >
                  Player loses a life <HeartCrackIcon className="size-6 stroke-red-500" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { handleDetonateNuke(player.id) }}
                  className={cn(
                    buttonVariants({
                      variant: "outline"
                    }),
                    "justify-between text-base",
                  )}
                >
                  Player detonates a Nuke <RadioActiveIcon />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))
          :
          trackerData.map((player, idx) => (
            <ParticipantCard.loading key={`${player.name}-${idx}`} size={trackerSession.session.cardSize} />
          ))
        }
      </div>

      {/* nuke conflict dialog */}
      {isHydrated &&
        <AlertDialog open={openNukeDialog} onOpenChange={setOpenNukeDialog} >
          <NukeDialogContent toBeNukedPlayers={toBeNukedPlayers} handleNuking={handleNuking} />
        </AlertDialog>
      }
    </div>
  );
}
