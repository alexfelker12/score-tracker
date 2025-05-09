"use client"

//* hooks
import { useNukeConfirmation } from "@/hooks/use-confirmation";

//* components
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Player } from "../players/player";

export const ConflictDialog = () => {
  const { isConfirmationOpen, confirmationData, handleConfirm } = useNukeConfirmation();

  return (
    <AlertDialog open={isConfirmationOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>A nuke is incoming</AlertDialogTitle>
          <AlertDialogDescription>
            There are certain people about to drown. Who is surviving (for now)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          {confirmationData.map((affectedPlayer) => (
            <Player
              key={affectedPlayer.id}
              isNotIdle
              lifes={1}
              isSwimming={false}
              isWinner={false}
              hideDealer
              player={affectedPlayer}
              onClick={() => { handleConfirm(affectedPlayer) }}
              className="cursor-pointer"
            />
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}