"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ManSwimmingIcon } from "@/components/ui/icons/man-swimming";
import { RadioActiveIcon } from "@/components/ui/icons/radioactive";
import { SkullIcon } from "@/components/ui/icons/skull";
import { Slider } from "@/components/ui/slider";
import { SCHWIMMENLOCALSTORAGEBASEKEY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { participantsSchemaBase } from "@/schema/participants";
import { Player, SchwimmenSessionStore, useSchwimmenSessionStore } from "@/store/schwimmenSessionStore";
import { HeartCrackIcon, HeartIcon, LoaderCircleIcon, RepeatIcon } from "lucide-react";
import React from "react";
import { z } from "zod";

export type TrackerType = {
  trackerData: z.infer<typeof participantsSchemaBase.shape.players>
  trackerId: string
}

export const Tracker = ({ trackerData, trackerId }: TrackerType) => {
  //* hooks here
  const trackerSession = useSchwimmenSessionStore();
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [size, setSize] = React.useState<number>(2)
  const [openNukeDialog, setOpenNukeDialog] = React.useState<boolean>(false)
  const [toBeNukedPlayers, setToBeNukedPlayers] = React.useState<Player[]>([])

  React.useEffect(() => {
    if (trackerData) {
      //* dynamic storage name
      useSchwimmenSessionStore.persist.setOptions({
        name: `schwimmen-tracker-${trackerId}`,
      })
      useSchwimmenSessionStore.persist.rehydrate()
      if (localStorage.getItem(SCHWIMMENLOCALSTORAGEBASEKEY)) localStorage.removeItem(SCHWIMMENLOCALSTORAGEBASEKEY);

      setIsHydrated(useSchwimmenSessionStore.persist.hasHydrated())

      if (!localStorage.getItem(`schwimmen-tracker-${trackerId}`)) trackerSession.init(trackerData)
    }
  }, [trackerData])

  const handleDetonateNuke = (playerId: number) => {
    const conflictingPlayers = trackerSession.detonateNuke(playerId)

    if (conflictingPlayers) {
      setToBeNukedPlayers(conflictingPlayers)
      setOpenNukeDialog(true)
    }
  }

  const handleNuking = (nukedPlayers: number[], survivorId: number) => {
    trackerSession.subtractLifes(nukedPlayers)
    trackerSession.setSwimmingPlayer(survivorId)
  }

  if (!isHydrated) return (
    <div className="flex justify-center items-center w-full h-full">
      <LoaderCircleIcon className="animate-spin size-8" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4">

        {/* reset - dialog */}
        <ResetSessionDialog trackerSession={trackerSession} trackerData={trackerData} />

        {/* text size slider */}
        <div className="flex flex-1 gap-2">
          <span className="text-sm leading-none">XS</span>
          <Slider
            min={0}
            max={4}
            value={[size]}
            defaultValue={[size]}
            onValueChange={(value) => setSize(value[0])}
            step={1}
          />
          <span className="text-sm leading-none">XL</span>
        </div>

      </div>

      {/* participants cards */}
      <div className="flex flex-col gap-4 w-full">
        {trackerSession.session.players.map((player) => (
          <DropdownMenu key={player.id}>
            <DropdownMenuTrigger disabled={player.lifes === 0}>
              <ParticipantCard {...player} size={size} playerSwimming={trackerSession.session.playerSwimming} />
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
        ))}
      </div>

      {/* nuke conflict dialog */}
      <AlertDialog open={openNukeDialog} onOpenChange={setOpenNukeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>A nuke is incoming</AlertDialogTitle>
            <AlertDialogDescription>There are several people about to drown. Who is surviving (for now)?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:justify-between gap-4">
            {toBeNukedPlayers.map((player) => (
              <AlertDialogAction
                key={player.id}
                onClick={() => handleNuking(toBeNukedPlayers
                  //* filter out clicked player since he is the survivor
                  .filter((toBeNukedPlayer) => toBeNukedPlayer.id !== player.id)
                  //* map to ids only
                  .map((nukedPlayer) => nukedPlayer.id),
                  //* pass survivor id to set as swimming
                  player.id
                )}
                asChild
              >
                <Button
                  className="rounded-xl bg-transparent p-0 [&>*]:flex-1 [&>*]:w-full h-auto hover:bg-transparent hover:[&>*]:bg-accent"
                >
                  <ParticipantCard {...player} size={size} />
                </Button>
              </AlertDialogAction>
            ))}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


const ICON_SIZE_MAP = [
  "size-6",
  "size-7",
  "size-8",
  "size-9",
  "size-10",
] as const
const TEXT_SIZE_MAP = [
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
] as const

type ParticipantCardType = Player & {
  size: number
  playerSwimming?: number
}
const ParticipantCard = ({ id, lifes, name, size, playerSwimming }: ParticipantCardType) => {
  return (
    <Card
      key={id}
      className={cn("p-2",
        lifes <= 0 && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex justify-between items-center gap-4">
        <span
          className={cn("text-sm",
            TEXT_SIZE_MAP[size]
          )}
        >{name}</span>

        <div className="flex gap-1 w-fit">
          {playerSwimming === id && lifes > 0 ?
            <ManSwimmingIcon className={ICON_SIZE_MAP[size]} />
            :
            lifes === 0 ?
              <SkullIcon className={ICON_SIZE_MAP[size]} />
              :
              Array.from({ length: lifes }).map((_, idx) => (
                <HeartIcon key={idx}
                  className={cn("size-6 stroke-red-500 fill-red-500",
                    ICON_SIZE_MAP[size]
                  )}
                />
              ))
          }
        </div>
      </div>
    </Card>
  );
}

type ResetSessionDialogType = {
  trackerSession: SchwimmenSessionStore
  trackerData: TrackerType["trackerData"]
}
const ResetSessionDialog = ({ trackerSession, trackerData }: ResetSessionDialogType) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <RepeatIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset session data</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to reset the session data? All tracked progress will be lost</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => trackerSession.init(trackerData)}
          >Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
