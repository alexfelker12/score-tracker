"use client"

//* next/react
import React from "react";

//* lib
import { cn } from "@/lib/utils";

//* components
import { useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { Button } from "@/components/ui/button";

export const FinishedGameDialog = ({ className, ...params }: React.ComponentProps<"div">) => {
  const [open, setOpen] = React.useState<boolean>(true)
  const { game, checkWinCondition, getLatestRound } = useSchwimmenGameStore()

  if (game.status === "ACTIVE") return null;

  const winningPlayer = checkWinCondition("latest")

  return (
    <div
      className={cn(
        "z-20 absolute inset-0 place-items-center !-m-1 transition-[backdrop-filter,opacity] duration-300",
        //* starting style
        "starting:backdrop-blur-none starting:opacity-0",
        //* transition end style
        "backdrop-blur-[3px] opacity-100",
        open ? "grid" : "hidden",
        className
      )}
      {...params}
    >
      <div className="space-y-2 bg-secondary/80 shadow-sm px-6 py-4 border rounded-xl text-card-foreground text-center">

        {game.status === "COMPLETED" && winningPlayer ?
          //* game is COMPLETED
          <>
            <div>
              <h3 className="text-xl">Game completed</h3>
              <p className="text-muted-foreground text-sm">finished in {getLatestRound().round} rounds</p>
            </div>

            <p className="mt-2"><span className="text-primary">{winningPlayer.displayName}</span> won!</p>

            <Button
              variant="inline"
              size="inline"
              onClick={() => setOpen(false)}
            >see rounds</Button>
          </>
          : game.status === "CANCELLED" &&
          //* game is CANCELLED
          <>

          </>
        }

      </div>
    </div>
    // {game.status === "COMPLETED"
    //   ? `Game is finished. ${winningPlayer?.displayName} won the Round!`
    //   : game.status === "CANCELLED" && `Game was cancelled, does not count towards leaderboard stats.`
    // }
  );
}