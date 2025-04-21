"use client"

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useConfirmation } from "@/hooks/use-confirmation";

export const ConflictDialog = () => {
  const { isConfirmationOpen, confirmationData, handleConfirm } = useConfirmation();

  return (
    <AlertDialog open={isConfirmationOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>A nuke is incoming</AlertDialogTitle>
          <AlertDialogDescription>
            There are certain people about to drown. Who is surviving (for now)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          {confirmationData.map((affectedPlayer) => (
            <p key={affectedPlayer.id} onClick={() => { handleConfirm(affectedPlayer) }} className="cursor-pointer">
              {affectedPlayer.displayName}
            </p>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}