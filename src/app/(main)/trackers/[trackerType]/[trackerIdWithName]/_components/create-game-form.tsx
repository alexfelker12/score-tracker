"use client"

import { useRouter } from "next/navigation"
import React from "react"

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TrackerPlayer, User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"

import { createGame } from "@/server/actions/game/actions"

import { getQueryClient } from "@/lib/get-query-client"

import { DicesIcon, GripHorizontalIcon, Loader2Icon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LabeledSeparator } from "@/components/ui/labeled-separator"
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
  //* hooks
  const { invalidateQueries } = getQueryClient()
  const { push } = useRouter()

  const [error, setError] = React.useState<string | null>()
  const [selectedPlayerIds, setSelectedPlayerIds] = React.useState<string[]>(
    players.map((player) => player.id)
  )

  // POST mutation: tracker
  const { mutate, isPending } = useMutation({
    mutationKey: ['trackers', trackerId, 'game-create'],
    mutationFn: createGame,
    onSettled: async (data, error) => {
      if (!error && data && data.data) {
        push(`/trackers/schwimmen/${data.data.trackerId}-${encodeURIComponent(data.data.tracker.displayName)}/${data.data.id}`)

        //* invalidate query to refetch latest data
        await invalidateQueries({ queryKey: ["trackers", trackerId] })
      }
    },
  })
  function handleCreateGame() {
    if (selectedPlayerIds.length > maxPlayers || selectedPlayerIds.length < minPlayers) return;

    mutate({
      trackerId,
      players: selectedPlayerIds.map((selectedPlayerId, sortIndex) => ({
        playerId: selectedPlayerId,
        order: sortIndex
      }))
    })
  }

  //* update players when tracker players change
  React.useEffect(() => {
    const newIds = players.map(p => p.id)
    setSelectedPlayerIds((prev) => {
      const stillValid = prev.filter(id => newIds.includes(id))
      const added = newIds.filter(id => !stillValid.includes(id))
      return [...stillValid, ...added]
    })

    // reevaluate error on player amount change
    const minPlayerError = (players.length > maxPlayers) && `Maximum ${maxPlayers} participants allowed`
    const maxPlayerError = (players.length < minPlayers) && `Minimum ${minPlayers} participants required`
    setError(minPlayerError || maxPlayerError || null)
  }, [players])


  // setup DnD Kit
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = selectedPlayerIds.indexOf(String(active.id))
      const newIndex = selectedPlayerIds.indexOf(String(over.id))
      setSelectedPlayerIds(arrayMove(selectedPlayerIds, oldIndex, newIndex))
    }
  }
  function handleSelectionChange(newSelectedIds: string[]) {
    const newOrdered = selectedPlayerIds.filter(id => newSelectedIds.includes(id))

    newSelectedIds.forEach(id => {
      if (!newOrdered.includes(id)) newOrdered.push(id)
    })

    setSelectedPlayerIds(newOrdered)

    if (newSelectedIds.length > maxPlayers) {
      setError(`Maximum ${maxPlayers} participants allowed`)
    } else if (newSelectedIds.length < minPlayers) {
      setError(`Minimum ${minPlayers} participants required`)
    } else {
      setError(null)
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="self-end"><DicesIcon /> New game</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose participants</DialogTitle>
          <DialogDescription>
            Deselect players who should not participate in this game and sort selected players in their card dealing order
          </DialogDescription>
        </DialogHeader>

        {/* see https://chatgpt.com/c/67f9c586-41d4-800c-a862-ba29afeb5cc5 for scroll shadow */}

        <div className="-my-1 -mr-2 -ml-1 py-1 pr-2 pl-1 w-[calc(100%+.75rem)] overflow-y-auto">
          <ToggleGroup
            type="multiple"
            orientation="vertical"
            className="flex-col flex-1 gap-2 w-full"
            value={selectedPlayerIds}
            onValueChange={handleSelectionChange}
          >
            {/** selected players, simultaneously the orderable players */}
            {(selectedPlayerIds.length > 0) &&
              <>
                <LabeledSeparator className="w-full">selected players</LabeledSeparator>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={selectedPlayerIds} strategy={verticalListSortingStrategy}>
                    {selectedPlayerIds.map((id, idx) => {
                      const player = players.find(p => p.id === id)!
                      return (
                        <SortablePlayerItem
                          key={id}
                          trackerPlayer={player}
                          sortIndex={idx + 1}
                        />
                      )
                    })}
                  </SortableContext>
                </DndContext>
              </>
            }

            {/* deselected players */}
            {(players.length > selectedPlayerIds.length) &&
              <>
                <LabeledSeparator className="w-full">deselected players</LabeledSeparator>

                {players
                  .filter(p => !selectedPlayerIds.includes(p.id))
                  .map((player) => (
                    <StaticPlayerItem key={player.id} trackerPlayer={player} />
                  ))}
              </>
            }
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

type TrackerPlayerCardProps = {
  trackerPlayer: TrackerPlayerWithUser
}

const SortablePlayerItem = ({ trackerPlayer, sortIndex }: TrackerPlayerCardProps & { sortIndex: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: trackerPlayer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <ToggleGroupItem
      value={trackerPlayer.id}
      className="flex items-center gap-2 data-[state=on]:bg-background shadow-sm px-2 py-1.5 border data-[state=on]:border-primary/50 rounded-lg w-full text-muted-foreground text-sm data-[state=on]:text-accent-foreground"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between items-center gap-1.5 w-full">
        {/* Tracker player details and order index*/}
        <div className="flex items-center gap-1.5">
          <span>{sortIndex}.</span>
          <TrackerPlayerCardDetails trackerPlayer={trackerPlayer} />
        </div>

        {/* Drag Handle */}
        <span
          {...attributes}
          {...listeners}
          className="p-1.5 text-muted-foreground cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripHorizontalIcon className="size-6" />
        </span>
      </div>
    </ToggleGroupItem>
  )
}

const StaticPlayerItem = ({ trackerPlayer }: TrackerPlayerCardProps) => {
  return (
    <ToggleGroupItem
      value={trackerPlayer.id}
      className="flex items-center gap-2 bg-muted/30 hover:bg-muted/40 shadow-sm px-2 py-1.5 border border-muted-foreground/20 rounded-lg w-full text-muted-foreground text-sm"
    >
      <div className="flex justify-start items-center gap-1.5 w-full">
        <TrackerPlayerCardDetails trackerPlayer={trackerPlayer} />
      </div>
    </ToggleGroupItem>
  );
}

const TrackerPlayerCardDetails = ({ trackerPlayer }: TrackerPlayerCardProps) => {
  return (
    <>
      <Avatar className="size-9">
        <AvatarImage src={trackerPlayer.player && trackerPlayer.player.image || undefined}></AvatarImage>
        <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center items-start gap-1">
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

