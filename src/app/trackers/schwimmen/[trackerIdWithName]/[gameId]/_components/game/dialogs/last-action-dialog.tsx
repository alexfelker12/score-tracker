"use client"

//* hooks
import { useLastActionConfirmation } from "@/hooks/use-confirmation";

//* components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Player } from "../players/player";

export const LastActionDialog = () => {
  const { isConfirmationOpen, confirmationData: winningPlayer, handleConfirm, handleCancel } = useLastActionConfirmation();

  if (winningPlayer) return (
    <AlertDialog open={isConfirmationOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Last Round</AlertDialogTitle>
          <AlertDialogDescription>
            This will be the last round played and the following player will be winner of this game:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <Player
            isNotIdle
            lifes={1}
            isSwimming={false}
            isWinner={true}
            player={winningPlayer}
            className="cursor-pointer"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { handleCancel() }}>Go back</AlertDialogCancel>
          <AlertDialogAction onClick={() => { handleConfirm() }}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent >
    </AlertDialog>
  );
}