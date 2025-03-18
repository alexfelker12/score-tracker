import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SchwimmenSessionStore } from "@/store/schwimmenSessionStore";
import { RepeatIcon } from "lucide-react";
import { TrackerType } from "./tracker";


export type ResetSessionDialogType = {
  trackerSession: SchwimmenSessionStore
  trackerData: TrackerType["trackerData"]
  isInitializing?: boolean
}

export const ResetSessionDialog = ({ trackerSession, trackerData, isInitializing }: ResetSessionDialogType) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isInitializing}
        >
          <RepeatIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset session data</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to reset the session data? All tracked progress will be lost</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!isInitializing) trackerSession.init(trackerData);
            }}
          >Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
