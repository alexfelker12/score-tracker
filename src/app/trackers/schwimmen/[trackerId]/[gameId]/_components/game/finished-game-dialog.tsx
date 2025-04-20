"use client"

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useSchwimmenGameStore } from "@/store/schwimmenGameStore";

export const FinishedGameDialog = () => {
  const { game, checkWinCondition } = useSchwimmenGameStore()

  const winningPlayer = checkWinCondition("latest")

  // TODO: build own "dialog" (or rather overlay), because radix-ui's dialog sets everything to aria-hidden="true" and can't be used in this case

  return (
    <>game is finished</>
    // <AlertDialog open={false}>
    //   <AlertDialogContent onEscapeKeyDown={undefined} container={ref?.current}>
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>Game finished!</AlertDialogTitle>
    //       <AlertDialogDescription>
    //         {game.status === "COMPLETED"
    //           ? `Game is finished. ${winningPlayer?.displayName} won the Round!`
    //           : game.status === "CANCELLED" && `Game was cancelled, does not count towards leaderboard stats.`
    //         }
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //   </AlertDialogContent>
    // </AlertDialog>
  );
}