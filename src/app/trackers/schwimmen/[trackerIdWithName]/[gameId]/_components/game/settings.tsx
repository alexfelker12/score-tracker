"use client"

//* next/react
import React from "react";

//* packages
import { useMutation } from "@tanstack/react-query";

//* server
import { updateGameStatusAndData } from "@/server/actions/game/actions";
import { deleteRoundsFromRoundNumber } from "@/server/actions/game/roundData/actions";

//* lib
import { cn } from "@/lib/utils";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";

//* icons
import { CheckIcon, Loader2Icon, SettingsIcon, XIcon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SCHWIMMEN_ICON_SIZE_MAP } from "@/lib/constants";


// export type SettingsParams = {}, params: SettingsParams, const { } = params
export const Settings = () => {
  //* hooks here
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
  const [resetOpen, setResetOpen] = React.useState<boolean>(false)
  const [cancelOpen, setCancelOpen] = React.useState<boolean>(false)
  // stores
  const { game, isAction, getLatestRound, setCurrentRoundNumber, resetRounds, finishGame } = useSchwimmenGameStore()
  const { meta, setHideDead, setUiSize, setIsAdjustingSize } = useSchwimmenMetaStore()

  //* DELETE reset game - delete every round from round 0
  const { mutate: deleteRoundsFrom, isPending: isResetPending } = useMutation({ mutationFn: deleteRoundsFromRoundNumber })
  //* PUT game status - cancel game if active
  const { mutate: updateGame, isPending: isCancelPending } = useMutation({ mutationFn: updateGameStatusAndData })

  //* checks
  const isFirstRound = getLatestRound().round === 0
  const isResetOpenOrPending = isResetPending || resetOpen
  const isCancelOpenOrPending = isCancelPending || cancelOpen
  const isResetOrCancelOpenOrPending = isResetOpenOrPending || isCancelOpenOrPending

  //* reset/cancel handler
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
          size={`game${SCHWIMMEN_ICON_SIZE_MAP[meta.uiSize[0]]}`}
          variant="outline"
          disabled={!isAction(ActionStatus.ISIDLE)}
        >
          <SettingsIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "gap-6 [&_.hide-on-adjust]:transition-opacity",
          meta.isAdjustingSize && "[&_.hide-on-adjust]:opacity-0 bg-background/0 border-transparent"
        )}
        isAdjusting={meta.isAdjustingSize}
      >
        <DialogHeader className="hide-on-adjust">
          <DialogTitle>Game settings</DialogTitle>
          <DialogDescription>
            Adjust appearance and progress
          </DialogDescription>
        </DialogHeader>

        {/* all options */}
        <div className="space-y-6">

          {/* option 1 - hide dead player */}
          <div className={cn("flex flex-wrap gap-1 hide-on-adjust", isResetOrCancelOpenOrPending && "opacity-50")}>
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
          <div className={cn("flex flex-wrap gap-3", isResetOrCancelOpenOrPending && "opacity-50")}>
            <div className="w-full hide-on-adjust">
              <h4 id="ui-sizer-label" className="font-medium text-base leading-none">Adjust game size</h4>
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <span className="text-muted-foreground text-xs leading-none hide-on-adjust">XS</span>
              <Slider id="ui-sizer" aria-labelledby="ui-sizer-label"
                min={0} max={4} step={1}
                value={meta.uiSize}
                onValueChange={(value) => {
                  if (isResetOrCancelOpenOrPending) return;
                  setUiSize(value)
                }}
                onPointerDown={() => {
                  if (isResetOrCancelOpenOrPending) return;
                  setIsAdjustingSize(true)
                }}
                onPointerUp={() => {
                  if (isResetOrCancelOpenOrPending) return;
                  setIsAdjustingSize(false)
                }}
                disabled={isResetOrCancelOpenOrPending}
              />
              <span className="text-muted-foreground text-xs leading-none hide-on-adjust">XL</span>
            </div>
          </div>

          {/* option 3 - reset game */}
          <div className={cn("flex flex-wrap gap-1 hide-on-adjust", (isFirstRound || isCancelOpenOrPending) && "opacity-50")}>
            <div>
              <h4 id="reset-game-label" className="font-medium text-base">Reset game</h4>
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
                size={isResetOpenOrPending ? "icon" : "default"}
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
                <Button variant="destructive" size="icon" onClick={handleReset}><CheckIcon /></Button>

              </div>
            </div>}
          </div>

          {/* option 4 - cancel game */}
          <div className={cn("flex flex-wrap gap-1 hide-on-adjust", isResetOpenOrPending && "opacity-50")}>
            <div>
              <h4 id="cancel-game-label" className={cn("font-medium text-base", isResetOpenOrPending && "text-muted-foreground")}>Cancel game</h4>
            </div>
            <div className="flex justify-between items-center gap-4 w-full">
              <span id="cancel-game-desc" className="text-muted-foreground text-sm leading-[1.1rem]"><span className="text-destructive-foreground">Caution:</span> A canceled game cannot be played afterwards!</span>
              <Button
                id="cancel-game" aria-describedby="cancel-game-desc" aria-labelledby="cancel-game-label"
                variant={cancelOpen ? "secondary" : "destructive"}
                size={isCancelOpenOrPending ? "icon" : "default"}
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
                <Button variant="destructive" size="icon" onClick={handleCancel}><CheckIcon /></Button>
              </div>
            </div>}
          </div>

        </div>
      </DialogContent>
    </Dialog >
  );
}
