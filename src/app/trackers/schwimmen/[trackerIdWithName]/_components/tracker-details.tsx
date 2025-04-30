"use client"

//* next/react
import Link from "next/link";
import React from "react";

//* packages
import { TrackerPlayer, User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";

//* server
import { getTrackerById } from "@/server/actions/tracker/actions";

//* lib
import { useSession } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/get-query-client";
import { cn } from "@/lib/utils";

//* icons
import { Loader2Icon, Trash2Icon, UserIcon } from "lucide-react";

//* components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addPlayerToTracker, deleteTrackerPlayerById } from "@/server/actions/tracker/trackerPlayer/actions";

//* local
import { AddPlayerDialog } from "../../_components/tracker-create-form";
import { TimeElapsed } from "../../_components/trackers";
import { TrackerDetailsWrapProps } from "../page";
import { CreateGameForm } from "./create-game-form";


export type TrackerDetailsProps = TrackerDetailsWrapProps & {}
export const TrackerDetails = ({ trackerId }: TrackerDetailsProps) => {
  const { data: session, isPending: isSessionPending } = useSession()

  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["trackers", trackerId],
    queryFn: () => getTrackerById(trackerId),
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  //* POST create player
  const { mutate: addPlayer, isPending: isAddingPending } = useMutation({
    mutationKey: ["trackers", trackerId, "add-player"],
    mutationFn: addPlayerToTracker,
    onSettled: async (data) => {
      if (data && data.data) {
        await qc.invalidateQueries({ queryKey: ["trackers", trackerId] })
      } else if (data && data.error) { }
    },
  })

  //* DELETE tracker player
  const qc = getQueryClient()
  const { mutate: deletePlayer, isPending: isDeletePending } = useMutation({
    mutationKey: ["trackers", trackerId, "delete-player"],
    mutationFn: deleteTrackerPlayerById,
    onSettled: async (data) => {
      if (data && data.data) {
        await qc.invalidateQueries({ queryKey: ["trackers", trackerId] })
        setPendingDeleteId(null) // Reset pending ID after deletion completes
      } else if (data && data.error) {
        setPendingDeleteId(null) // Also reset on error
      }
    },
  })


  if (isPending) return <LoadingTrackerDetails />
  if (!data) return <ErrorMessage />
  if (data.error) return <ErrorMessage error={data.error} />
  if (!data.data) return <InvalidTrackerMessage />

  if (data.data) return (
    <div className="flex flex-col gap-4">

      <p className="font-semibold text-xl">
        {data.data.displayName}
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3>Players:</h3>
          {isSessionPending
            ? <div className="flex justify-center items-center px-1.5 border border-transparent w-9"><Loader2Icon className="text-primary animate-spin" /></div>
            : session && <div
              className={cn((isAddingPending || isDeletePending || data.data.players.length >= 9 || session.user.id !== data.data?.creatorId) && "opacity-50 pointer-events-none")}
            >
              <AddPlayerDialog
                userId={session.user.id}
                userPlayers={data.data.players.flatMap((trackerPlayer) => trackerPlayer.player ? trackerPlayer.player.id : [])}
                guestPlayers={data.data.players.flatMap((trackerPlayer) => trackerPlayer.player ? [] : trackerPlayer.displayName)}
                saveFunc={(participant) => {
                  if (isAddingPending || isDeletePending || (data.data && data.data.players.length >= 9) || !session || session.user.id !== data.data?.creatorId) return;

                  addPlayer({
                    userId: session.user.id,
                    trackerId: trackerId,
                    playerOrGuest: {
                      displayName: participant.guest ? participant.name : participant.user.displayUsername || participant.user.name,
                      player: !participant.guest ? participant.user : undefined
                    }
                  })
                }}
                canAddField={true}
              />
            </div>
          }
        </div>
        {data.data.players.map((trackerPlayer) => {
          return (
            <div key={trackerPlayer.id} className="flex justify-between items-center gap-4 p-1.5 border rounded-lg">
              <div className="flex items-center gap-2">
                <TrackerPlayerDetails trackerPlayer={trackerPlayer} />
              </div>
              {session && session.user.id === trackerPlayer.playerId
                ? <span className="w-9 text-center text-muted-foreground text-sm italic">you</span>
                : <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={
                        isSessionPending ||
                        !session ||
                        session.user.id !== data.data?.creatorId ||
                        data.data?.players.length <= 2 ||
                        (isDeletePending && pendingDeleteId !== trackerPlayer.id)
                      }
                    >
                      {isDeletePending && pendingDeleteId === trackerPlayer.id ?
                        <Loader2Icon className="animate-spin" /> :
                        <Trash2Icon />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will delete <span className="text-primary">{trackerPlayer.player ? trackerPlayer.player.displayUsername || trackerPlayer.player.name : trackerPlayer.displayName}</span> from this tracker
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          if (isSessionPending || !session || session.user.id !== data.data?.creatorId || data.data?.players.length <= 2) return;

                          // Set the pending delete ID to this player's ID
                          setPendingDeleteId(trackerPlayer.id)

                          deletePlayer({
                            userId: session.user.id,
                            trackerPlayerId: trackerPlayer.id
                          })
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              }
            </div>
          )
        })}
        {(isFetching && isAddingPending) && <Skeleton className="w-full h-[50px]" />}
      </div>

      <CreateGameForm
        minPlayers={2}
        maxPlayers={9}
        trackerId={trackerId}
        players={data.data.players}
      />

      <div>
        <h3>Games:</h3>
        {/* display games as tabs, each tab has games based on status */}
        {data.data.games.length > 0
          ? data.data.games.map((game) => {
            return (
              <div
                key={game.id}
                className="flex flex-wrap gap-x-2 mb-2"
              >
                <span>-</span>
                <Link href={`/trackers/schwimmen/${encodeURIComponent(game.tracker.id) + "-" + game.tracker.displayName}/${game.id}`}>{game.id} - {game.status}</Link>
                <span className="ml-[calc(6.41px+.5rem)] text-muted-foreground text-sm"><TimeElapsed createdAt={game.createdAt} /></span>
              </div>
            )
          })
          :
          <span className="italic">No games played yet</span>
        }
      </div>

    </div >
  );
}

type TrackerPlayerProps = {
  trackerPlayer: TrackerPlayer & {
    player: User | null
  }
}
const TrackerPlayerDetails = ({ trackerPlayer }: TrackerPlayerProps) => {
  return (
    <>
      <Avatar className="size-9">
        <AvatarImage src={trackerPlayer.player && trackerPlayer.player.image || undefined}></AvatarImage>
        <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        {trackerPlayer.player
          ? <>
            <span className="font-medium text-sm leading-none">{trackerPlayer.player.displayUsername || trackerPlayer.player.name}</span>
            <span className="text-muted-foreground text-xs leading-none">{trackerPlayer.player.email}</span>
          </>
          : <>
            <span className="font-medium text-sm leading-none">{trackerPlayer.displayName}</span>
            <span className="text-muted-foreground text-xs italic leading-none">Guest</span>
          </>}
      </div>
    </>
  );
}


const LoadingTrackerDetails = () => (
  <div className="flex flex-1 justify-center items-center">
    <Loader2Icon className="text-primary animate-spin size-8" />
  </div>
)
const ErrorMessage = ({ error = "Server Error" }: { error?: unknown }) => (
  <p>
    There was an error loading this tracker:
    {JSON.stringify(error, null, 2)}
  </p>
)
const InvalidTrackerMessage = () => (
  <p>
    This tracker is invalid. Create a new one <Link href="/trackers/schwimmen" className="text-primary">here</Link>.
  </p>
)
