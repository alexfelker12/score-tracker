import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Player } from "@/store/schwimmenSessionStore";
import { ParticipantCard } from "./tracker-participant-card";

export type NukeDialogType = {
  toBeNukedPlayers: Player[]
  handleNuking: (nukedPlayers: number[], survivorId: number) => void
}

export const NukeDialogContent = ({ toBeNukedPlayers, handleNuking }: NukeDialogType) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>A nuke is incoming</AlertDialogTitle>
        <AlertDialogDescription>There are several people about to drown. Who is surviving (for now)?</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-col sm:flex-col sm:justify-between gap-4">
        {toBeNukedPlayers.map((player) => (
          <AlertDialogAction
            key={player.id}
            onClick={() => handleNuking(toBeNukedPlayers
              //* filter out clicked player since he is the survivor
              .filter((toBeNukedPlayer) => toBeNukedPlayer.id !== player.id)
              //* map to ids only
              .map((nukedPlayer) => nukedPlayer.id),
              //* pass survivor id to set as swimming
              player.id
            )}
            asChild
          >
            <Button
              className="rounded-xl bg-transparent p-0 [&>*]:flex-1 [&>*]:w-full h-auto hover:bg-transparent hover:[&>*]:bg-accent"
            >
              <ParticipantCard {...player} size={3} />
            </Button>
          </AlertDialogAction>
        ))}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
