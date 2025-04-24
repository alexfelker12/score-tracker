"use client"

import { useRouter } from "next/navigation"
import React from "react"

import { TrackerPlayer, User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"

import { createGame } from "@/server/actions/game/actions"

import { getQueryClient } from "@/lib/get-query-client"

import { Loader2Icon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

//* types
type TrackerPlayerWithUser = TrackerPlayer & {
  player: User | null
}
export type CreateGameFormParams = {
  minPlayers: number
  maxPlayers: number
  trackerId: string
  players: TrackerPlayerWithUser[]
}


//* main
export const CreateGameForm = ({ minPlayers, maxPlayers, trackerId, players }: CreateGameFormParams) => {
  const [error, setError] = React.useState<string | null>(null)
  const [selectedPlayerIds, setSelectedPlayerIds] = React.useState<string[]>(
    players.map((player) => player.id)
  )

  //* router for redirect after create
  const router = useRouter()

  //* query client - for future query key invalidation
  const qc = getQueryClient()

  //* POST mutation: tracker
  const { mutate, isPending } = useMutation({
    mutationKey: ['trackers', trackerId, 'game-create'],
    mutationFn: createGame,
    onSettled: async (data, error) => {
      if (!error && data && data.data) {
        //* invalidate query to refetch latest data
        qc.invalidateQueries({ queryKey: ["trackers", trackerId] })

        const redirectUrl = `/trackers/schwimmen/${data.data.trackerId}-${encodeURIComponent(data.data.tracker.displayName)}/${data.data.id}`

        router.push(redirectUrl)
      }
    },
  })

  function handleCreateGame() {
    if (selectedPlayerIds.length > maxPlayers || selectedPlayerIds.length < minPlayers) return;

    mutate({
      trackerId,
      playerIds: selectedPlayerIds
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create a game</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[95%]">
        <DialogHeader>
          <DialogTitle>Choose participants</DialogTitle>
          <DialogDescription>
            Deselect players who should not participate in this game
          </DialogDescription>
        </DialogHeader>

        {/* see https://chatgpt.com/c/67f9c586-41d4-800c-a862-ba29afeb5cc5 for scroll shadow */}

        <div className="-my-1 -mr-2 -ml-1 py-1 pr-2 pl-1 w-[calc(100%+.75rem)] overflow-y-auto">
          <ToggleGroup
            type="multiple"
            orientation="vertical"
            className="flex-col flex-1 gap-2 w-full"
            value={selectedPlayerIds}
            onValueChange={(players) => {
              if (players.length > maxPlayers) {
                setError(`Maximum ${maxPlayers} participants allowed`)
              } else if (players.length < minPlayers) {
                setError(`Minimum ${minPlayers} participants required`)
              } else {
                setError(null)
              }

              setSelectedPlayerIds(players)
            }}
          >
            {players.map(player => (
              <ToggleGroupItem
                asChild
                key={player.id}
                value={player.id}
                className="flex flex-1 justify-start bg-background data-[state=on]:bg-background hover:bg-background shadow-sm px-2 py-1.5 border data-[state=on]:border-primary hover:border-primary/60 rounded-lg w-full text-muted-foreground text-sm data-[state=on]:text-accent-foreground data-[state=on]:ring-ring/50 data-[state=on]:ring-[1.5px]"
              >
                <div>
                  <TrackerPlayerCardDetails trackerPlayer={player} />
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <DialogFooter>
          <Button
            disabled={selectedPlayerIds.length > maxPlayers || selectedPlayerIds.length < minPlayers || isPending}
            size="lg"
            onClick={handleCreateGame}
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : "Start game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type TrackerPlayerCardDetailsProps = {
  trackerPlayer: TrackerPlayerWithUser
}
const TrackerPlayerCardDetails = ({ trackerPlayer }: TrackerPlayerCardDetailsProps) => {
  return (
    <>
      <Avatar className="size-9">
        <AvatarImage src={trackerPlayer.player && trackerPlayer.player.image || undefined}></AvatarImage>
        <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm leading-none">{trackerPlayer.player && trackerPlayer.player.displayUsername || trackerPlayer.displayName}</span>
        {trackerPlayer.player ?
          <span className="text-muted-foreground text-xs leading-none">{trackerPlayer.player.email}</span>
          :
          <span className="text-muted-foreground text-xs italic leading-none">Guest</span>
        }
      </div>
    </>
  );
}

