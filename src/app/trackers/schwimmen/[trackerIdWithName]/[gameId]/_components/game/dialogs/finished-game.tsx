"use client"

//* next/react
import Link from "next/link";
import React from "react";

//* stores
import { useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* lib
import { cn } from "@/lib/utils";

//* icons
import { ArrowRightIcon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const FinishedGame = ({ trackerPath }: { trackerPath: string }) => {
  const [finishedGameOverlayOpen, setFinishedGameOverlayOpen] = React.useState(true)
  const finishedGameOverlayRef = React.useRef<HTMLDivElement>(null)
  const game = useSchwimmenGameStore((state) => state.game)


  if (game.status === "COMPLETED") return (<>
    <Button
      variant="outline"
      onClick={() => setFinishedGameOverlayOpen(true)}
      className="border-primary/50 self-end"
      asChild
    >
      <motion.button layout>
        Continue <ArrowRightIcon />
      </motion.button>
    </Button>
    {finishedGameOverlayOpen && <CompletedDialog
      ref={finishedGameOverlayRef}
      onTransitionEndCapture={(event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.target === finishedGameOverlayRef.current && event.propertyName === "display") setFinishedGameOverlayOpen(false)
      }}
    />}
  </>);

  if (game.status === "CANCELLED") return <CanceledDialog trackerPath={trackerPath} />
}

const CompletedDialog = ({ className, ...params }: React.ComponentProps<"div">) => {
  const [startExitTransition, setStartExitTransition] = React.useState<boolean>(false)
  const { checkWinCondition, getLatestRound } = useSchwimmenGameStore()

  const winningPlayer = checkWinCondition()
  //* since the game starts with round 0, the first round will have the roundNumber 1 which if continuing equals the amount of rounds played at the end
  const amountRounds = getLatestRound().round

  // //? on hold - * CREATE game with same players, because game gets created with trackerPlayer ids. In game there are only game participants - think of a way to get tracker player ids
  // const qc = getQueryClient()
  // const router = useRouter()
  // const { mutate, isPending } = useMutation({
  //   mutationKey: ['trackers', game.trackerId, 'game-create'],
  //   mutationFn: createGame,
  //   onSettled: async (data) => {
  //     if (data && data.data) {
  //       //* invalidate query to refetch latest data
  //       qc.invalidateQueries({ queryKey: ["trackers", game.trackerId] })

  //       const redirectUrl = `/trackers/schwimmen/${data.data.trackerId}-${encodeURIComponent(data.data.tracker.displayName)}/${data.data.id}`

  //       router.push(redirectUrl)
  //     }
  //   },
  // })

  // const handlePlayAnother = () => {
  //   if (isPending) return
  //   mutate({ trackerId: game.trackerId, playerIds: players.map((player) => player..id) })
  // }

  if (winningPlayer) return (
    <div
      className={cn(
        "grid z-40 absolute inset-0 place-items-center !-m-1 transition-[display,backdrop-filter,opacity] duration-300 transition-discrete",
        //* starting style
        "starting:backdrop-blur-none starting:opacity-0",
        //* transition end style
        "backdrop-blur-[3px] opacity-100",
        startExitTransition && "backdrop-blur-none opacity-0 hidden",
        className
      )}
      {...params}
    >
      <div className="space-y-3 bg-background/85 shadow-sm px-6 py-4 border rounded-xl text-card-foreground text-center">
        <div>
          <h3 className="text-xl">Game completed</h3>
          <p className="text-muted-foreground text-sm">finished in {amountRounds} rounds</p>
        </div>

        <p
        // className="!mb-4"
        ><span className="text-primary">{winningPlayer.displayName}</span> won!</p>

        {/* <Button
          className="flex"
          onClick={handlePlayAnother}
          disabled={isPending}
        >
          {isPending && <Loader2Icon className="text-primary animate-spin" />} Play another Game
        </Button> */}

        <Button
          variant="inline"
          size="inline"
          onClick={() => {
            // if (isPending) return;
            setStartExitTransition(true)
          }}
        // disabled={isPending}
        >see rounds</Button>
      </div>
    </div>
  );
}

const CanceledDialog = ({ trackerPath, className, ...params }: React.ComponentProps<"div"> & { trackerPath: string }) => {
  const amountRounds = useSchwimmenGameStore((state) => state.getLatestRound)().round

  return (
    <div
      className={cn(
        "grid z-40 absolute inset-0 place-items-center !-m-1 transition-[display,backdrop-filter,opacity] duration-300 transition-discrete",
        //* starting style
        "starting:backdrop-blur-none starting:opacity-0",
        //* transition end style
        "backdrop-blur-[3px] opacity-100",
        className
      )}
      {...params}
    >
      <div className="space-y-3 bg-background/85 shadow-sm px-6 py-4 border rounded-xl text-card-foreground text-center">
        <div>
          <h3 className="text-xl">Game canceled!</h3>
          <p className="text-muted-foreground text-sm">{amountRounds} {amountRounds === 1
            ? "round was played"
            : "rounds were played"
          }</p>
        </div>

        <p className="mt-2">This game cannot be continued or viewed</p>

        <Button
          variant="link"
          size="inline"
          asChild
        >
          <Link href={`/trackers/schwimmen/${trackerPath}`}>
            go back to tracker
          </Link>
        </Button>
      </div>
    </div>
  );
}
