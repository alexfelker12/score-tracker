"use client"

//* next/react
import Link from "next/link";
import React, { Suspense, use } from "react";

//* packages
import { TrackerPlayer, User } from "@prisma/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

//* server
import { getTrackerById } from "@/server/actions/tracker/actions";
import { addPlayerToTracker, deleteTrackerPlayerById } from "@/server/actions/tracker/trackerPlayer/actions";

//* lib
import { cn, timeElapsed } from "@/lib/utils";

//* icons
import { Loader2Icon, Trash2Icon, UserIcon, UsersIcon } from "lucide-react";

//* components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

//* local
import { AddPlayerDialog } from "@/components/ui/trackers/add-player-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { getOtherUsers } from "@/server/actions/user/actions";
import { CreateGameForm } from "./create-game-form";
import { TrackerGames } from "./tracker-games";

export type TrackerDetailsProps = {
  session: typeof auth.$Infer.Session
  trackerId: string
  queryKey?: string[]
  dataPromise: ReturnType<typeof getTrackerById>
  playerDialogDataPromise: ReturnType<typeof getOtherUsers>
}
export const TrackerDetails = ({ session, trackerId, queryKey, dataPromise, playerDialogDataPromise }: TrackerDetailsProps) => {
  const { data: { data, error }, isPending, isFetching, refetch } = useSuspenseQuery({
    initialData: use(dataPromise),
    queryKey: queryKey || ["trackers", trackerId],
    queryFn: () => getTrackerById(trackerId),
    refetchOnMount: false, refetchOnReconnect: false
  })

  //* POST create player
  const { mutate: addPlayer, isPending: isAddingPending } = useMutation({
    mutationKey: ["trackers", trackerId, "add-player"],
    mutationFn: addPlayerToTracker,
    onSettled: async (data) => {
      if (data && data.data) {
        // await invalidateQueries({ queryKey: ["trackers", trackerId] })
        await refetch()
      } else if (data && data.error) { }
    },
  })

  //* DELETE tracker player
  const { mutate: deletePlayer, isPending: isDeletePending } = useMutation({
    mutationKey: ["trackers", trackerId, "delete-player"],
    mutationFn: deleteTrackerPlayerById,
    onSettled: async (data) => {
      if (data && data.data) {
        // await invalidateQueries({ queryKey: ["trackers", trackerId] })
        await refetch()
        setPendingDeleteId(null) // reset after deletion completes
      } else if (data && data.error) {
        setPendingDeleteId(null)
      }
    },
  })

  const [open, setOpen] = React.useState<boolean>(false)
  const [subOpen, setSubOpen] = React.useState<boolean>(false)
  const [sub2Open, setSub2Open] = React.useState<boolean>(false)
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

  //? invalidating not reliable, has conflicts with refetch options -> manual refetch
  // const { invalidateQueries } = getQueryClient()


  if (isPending) return <LoadingTrackerDetails />

  if (error) return <ErrorMessage error={error} />
  if (!data) return <InvalidTrackerMessage />

  if (data) return (
    <div className="flex flex-col gap-4">

      <div className="flex justify-between items-center">

        <h2 className="font-bold text-2xl">
          {data.displayName}
        </h2>

        <div className="flex gap-2">
          {/* participants */}
          <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
              >
                <UsersIcon />
              </Button>
            </DialogTrigger>

            <DialogContent hidden={subOpen || sub2Open} className="flex flex-col px-4">
              <DialogHeader>
                <DialogTitle>Tracker players</DialogTitle>
                <DialogDescription>Manage users to add them to a game</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 overflow-hidden">

                {session &&
                  <div
                    className={cn("pr-2 self-end",
                      (
                        isAddingPending
                        || isDeletePending
                      ) && "opacity-50 pointer-events-none"
                    )}
                  >
                    <Suspense fallback={<Skeleton className="w-32 h-9" />}>
                      <AddPlayerDialog
                        userId={session.user.id}
                        userPlayers={data.players.flatMap((trackerPlayer) => trackerPlayer.player ? trackerPlayer.player.id : [])}
                        guestPlayers={data.players.flatMap((trackerPlayer) => trackerPlayer.player ? [] : trackerPlayer.displayName)}
                        dataPromise={playerDialogDataPromise}
                        saveFunc={(participant) => {
                          if (
                            isAddingPending
                            || isDeletePending
                            || !session
                          ) return;

                          addPlayer({
                            // userId: session.user.id,
                            trackerId: trackerId,
                            playerOrGuest: {
                              displayName: participant.guest ? participant.name : participant.user.displayUsername || participant.user.name,
                              player: !participant.guest ? participant.user : undefined
                            }
                          })
                        }}
                        open={subOpen}
                        setOpen={setSubOpen}
                      />
                    </Suspense>
                  </div>
                }

                <div className="flex flex-col gap-2 px-2 overflow-y-auto">
                  {data.players.map((trackerPlayer) => {
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
                                  !session
                                  || (isDeletePending && pendingDeleteId !== trackerPlayer.id)
                                }
                              >
                                {isDeletePending && pendingDeleteId === trackerPlayer.id ?
                                  <Loader2Icon className="animate-spin" /> :
                                  <Trash2Icon />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              className="z-[100]"
                              onOpenAutoFocus={() => setSub2Open(true)}
                              onCloseAutoFocus={() => setSub2Open(false)}
                              hideOverlay
                            >
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
                                    // set the pending delete ID to this player's ID
                                    setPendingDeleteId(trackerPlayer.id)

                                    deletePlayer({
                                      trackerPlayerId: trackerPlayer.id,
                                      userIdIfPlayer: trackerPlayer.player?.id
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

              </div>

            </DialogContent>
          </Dialog>

          {/* new game */}
          <CreateGameForm
            minPlayers={2}
            maxPlayers={9}
            trackerId={trackerId}
            players={data.players}
          />
        </div>
      </div>


      <div>
        <h3>Games:</h3>
        {/* display games as tabs, each tab has games based on status */}
        <TrackerGames games={data.games} />
      </div>

    </div>
  );
}

type TrackerPlayerProps = {
  trackerPlayer: TrackerPlayer & {
    player: User | null
  }
}
export const TrackerPlayerDetails = ({ trackerPlayer }: TrackerPlayerProps) => {
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
