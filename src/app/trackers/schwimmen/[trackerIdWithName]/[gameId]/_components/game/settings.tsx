"use client"

//* next/react
//* packages
//* server
//* lib
//* local
//* hooks

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* icons
import { CheckIcon, Loader2Icon, SettingsIcon, XIcon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { deleteRoundsFromRoundNumber } from "@/server/actions/game/roundData/actions";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { updateGameStatusAndData } from "@/server/actions/game/actions";

/**
 ** head buttons:
 ** section 1 (left):
 * - options:
 *   - hide dead player (toggle)
 *   - card sizer (slider)
 *   - reset game (button)
 *   - cancel game (red button)
*/

// TODO Prio 4: settings

// export type SettingsParams = {}, params: SettingsParams, const { } = params
export const Settings = () => {
  //* hooks here
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
  const [resetOpen, setResetOpen] = React.useState<boolean>(false)
  const [cancelOpen, setCancelOpen] = React.useState<boolean>(false)
  // stores
  const { game, isAction, getLatestRound, setCurrentRoundNumber, resetRounds, finishGame } = useSchwimmenGameStore()
  const { meta, setHideDead, setUiSize } = useSchwimmenMetaStore()

  //* DELETE reset game - delete every round from round 0
  const { mutate: deleteRoundsFrom, isPending: isResetPending } = useMutation({ mutationFn: deleteRoundsFromRoundNumber })
  //* PUT game status - cancel game if active
  const { mutate: updateGame, isPending: isCancelPending } = useMutation({ mutationFn: updateGameStatusAndData })

  //* checks
  const isFirstRound = getLatestRound().round === 0
  const isResetOpenOrPending = isResetPending || resetOpen
  const isCancelOpenOrPending = isCancelPending || cancelOpen
  const isResetOrCancelOpenOrPending = isResetOpenOrPending || isCancelOpenOrPending

  const handleReset = () => {
    //* only do action when 
    if (isCancelOpenOrPending || isFirstRound || game.status !== "ACTIVE") return;

    setResetOpen(false)

    deleteRoundsFrom({ gameId: game.id, roundNumber: 0 }, {
      onSettled: (data) => {
        if (data && data.data) {
          //* when reset was successful sync with store and close settings
          setCurrentRoundNumber(0)
          resetRounds()
          setDialogOpen(false)
        }
      }
    })
  }

  const handleCancel = () => {
    if (isResetOpenOrPending || game.status !== "ACTIVE") return;

    setCancelOpen(false)

    updateGame({ gameId: game.id, newStatus: "CANCELLED" }, {
      onSettled: (data) => {
        if (data && data.data) {
          //* when reset was successful sync with store and close settings
          finishGame("CANCELLED")
          setDialogOpen(false)
        }
      }
    })
  }


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          disabled={!isAction(ActionStatus.ISIDLE)}
        >
          <SettingsIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Game settings</DialogTitle>
          <DialogDescription>
            Adjust appearance and progress
          </DialogDescription>
        </DialogHeader>

        {/* all options */}
        <div className="space-y-6">

          {/* option 1 - hide dead player */}
          <div className="flex flex-wrap gap-1">
            <div>
              <h4 id="hide-dead-label" className="font-medium text-base">Hide dead players</h4>
            </div>
            <div className="flex justify-between items-center gap-4 w-full">
              <span id="hide-dead-desc" className="text-muted-foreground text-sm leading-[1.1rem]">Control whether dead players should be visible during the game or not</span>
              <Switch
                id="hide-dead" aria-describedby="hide-dead-desc" aria-labelledby="hide-dead-label"
                checked={meta.hideDead}
                onCheckedChange={(checked) => {
                  if (isResetOrCancelOpenOrPending) return;
                  setHideDead(checked)
                }}
                disabled={isResetOrCancelOpenOrPending}
              />
            </div>
          </div>

          {/* option 2 - ui sizing */}
          <div className="flex flex-wrap gap-2">
            <div className="w-full">
              <h4 id="ui-sizer-label" className="font-medium text-base">Adjust game size</h4>
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <span className="text-muted-foreground text-xs leading-none">XS</span>
              <Slider
                id="ui-sizer" aria-labelledby="ui-sizer-label"
                min={1} max={5} step={1}
                value={meta.uiSize}
                onValueChange={(value) => {
                  if (isResetOrCancelOpenOrPending) return;
                  setUiSize(value)
                }}
                // onPointerDown={() => console.log("pointer down")}
                // onPointerUp={() => console.log("pointer up")}
                disabled={isResetOrCancelOpenOrPending}
              />
              <span className="text-muted-foreground text-xs leading-none">XL</span>
            </div>
          </div>

          {/* option 3 - reset game */}
          <div className="flex flex-wrap gap-1">
            <div>
              <h4 id="reset-game-label" className={cn("font-medium text-base", isFirstRound && "text-muted-foreground")}>Reset game</h4>
            </div>
            <div className="flex justify-between items-center gap-4 w-full">
              <span id="reset-game-desc" className="text-muted-foreground text-sm leading-[1.1rem]">
                <span className={cn("", isFirstRound ? "text-muted-foreground" : "text-destructive-foreground")}></span>
                {isFirstRound
                  ? <span>Reset not possible: there is no progress yet</span>
                  : <span><span className="text-destructive-foreground">Caution:</span> Game progress will be lost after resetting the game!</span>
                }
              </span>
              <Button
                id="reset-game" aria-describedby="reset-game-desc" aria-labelledby="reset-game-label"
                variant="secondary"
                onClick={() => setResetOpen(!resetOpen)}
                disabled={(isResetOrCancelOpenOrPending && !resetOpen) || isFirstRound || game.status !== "ACTIVE"}
              >
                {isResetPending
                  ? <Loader2Icon className="text-primary animate-spin" />
                  : resetOpen ? <XIcon /> : "Reset"
                }
              </Button>
            </div>
            {resetOpen && <div className="mt-2 w-full">
              <div className="flex justify-between items-center">
                <span>Are you sure?</span>
                <Button variant="destructive" onClick={handleReset}><CheckIcon /></Button>
              </div>
            </div>}
          </div>

          {/* option 4 - cancel game */}
          <div className="flex flex-wrap gap-1">
            <div>
              <h4 id="cancel-game-label" className="font-medium text-base">Cancel game</h4>
            </div>
            <div className="flex justify-between items-center gap-4 w-full">
              <span id="cancel-game-desc" className="text-muted-foreground text-sm leading-[1.1rem]"><span className="text-destructive-foreground">Caution:</span> A canceled game cannot be played afterwards!</span>
              <Button
                id="cancel-game" aria-describedby="cancel-game-desc" aria-labelledby="cancel-game-label"
                variant={cancelOpen ? "secondary" : "destructive"}
                onClick={() => setCancelOpen(!cancelOpen)}
                className="transition-colors"
                disabled={(isResetOrCancelOpenOrPending && !cancelOpen) || game.status !== "ACTIVE"}
              >
                {isCancelPending
                  ? <Loader2Icon className="text-primary animate-spin" />
                  : cancelOpen ? <XIcon /> : "Cancel"
                }
              </Button>
            </div>
            {cancelOpen && <div className="mt-2 w-full">
              <div className="flex justify-between items-center">
                <span>Are you sure?</span>
                <Button variant="destructive" onClick={handleCancel}><CheckIcon /></Button>
              </div>
            </div>}
          </div>

        </div>
      </DialogContent>
    </Dialog >
  );
}
