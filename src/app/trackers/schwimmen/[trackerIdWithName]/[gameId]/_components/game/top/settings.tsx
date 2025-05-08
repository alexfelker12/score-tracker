"use client"

//* next/react
import React from "react";

//* packages
import { useMutation } from "@tanstack/react-query";

//* server
import { updateGameStatusAndData } from "@/server/actions/game/actions";
import { deleteRoundsFromRoundNumber } from "@/server/actions/game/roundData/actions";

//* lib
import { SCHWIMMEN_TOP_ICON_SIZE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";

//* icons
import { CheckIcon, ChevronDownIcon, Loader2Icon, SettingsIcon, XIcon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LabeledSeparator } from "@/components/ui/labeled-separator";


// export type SettingsParams = {}, params: SettingsParams, const { } = params
export const Settings = () => {
  //* hooks here
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
  const [resetOpen, setResetOpen] = React.useState<boolean>(false)
  const [cancelOpen, setCancelOpen] = React.useState<boolean>(false)
  // stores
  const { game, isAction, getLatestRound, setCurrentRoundNumber, resetRounds, finishGame } = useSchwimmenGameStore()
  const { meta, setShowDealer, setHideDead, setUiSize, setIsAdjustingSize } = useSchwimmenMetaStore()

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
          size={`game${SCHWIMMEN_TOP_ICON_SIZE_MAP[meta.uiSize[0]]}`}
          variant="gameOutline"
          disabled={!isAction(ActionStatus.ISIDLE)}
          className="transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200"
        >
          <SettingsIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "gap-6 [&_.hide-on-adjust]:transition-opacity",
          meta.isAdjustingSize && "[&_.hide-on-adjust]:opacity-0 bg-background/0 border-transparent shadow-none"
        )}
        isAdjusting={meta.isAdjustingSize}
      >
        <DialogHeader className="hide-on-adjust">
          <DialogTitle>Game settings</DialogTitle>
          <DialogDescription className="sr-only">
            Adjust appearance, size and progress of this game
          </DialogDescription>
        </DialogHeader>

        {/* all options */}
        <div className="space-y-6">

          <section className="space-y-4 hide-on-adjust" aria-description="Control the appearance of game features">
            <LabeledSeparator className="!mb-2">Appearance</LabeledSeparator>

            {/* option - show card dealer */}
            <div className={cn("flex flex-wrap gap-1", isResetOrCancelOpenOrPending && "opacity-50")}>
              <div>
                <h4 id="show-dealer-label" className="font-medium text-base">Show card dealer</h4>
              </div>
              <div className="flex justify-between items-center gap-4 w-full">
                <span id="show-dealer-desc" className="text-muted-foreground text-sm leading-[1.1rem]">Control whether the card dealer of the current round should be shown</span>
                <Switch
                  id="show-dealer" aria-describedby="show-dealer-desc" aria-labelledby="show-dealer-label"
                  checked={meta.showDealer}
                  onCheckedChange={(checked) => {
                    if (isResetOrCancelOpenOrPending) return;
                    setShowDealer(checked)
                  }}
                  disabled={isResetOrCancelOpenOrPending}
                />
              </div>
            </div>

            {/* option - hide dead player */}
            <div className={cn("flex flex-wrap gap-1", isResetOrCancelOpenOrPending && "opacity-50")}>
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
          </section>

          <section className="space-y-4" aria-description="Adjust the size of game elements">
            <LabeledSeparator className="!mb-2 hide-on-adjust">Size</LabeledSeparator>

            {/* option - ui sizing */}
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
          </section>

          <section className="space-y-4 hide-on-adjust" aria-description="Handle game progress">
            <LabeledSeparator className="!mb-2">Progress</LabeledSeparator>

            {/* option - reset game */}
            <Collapsible
              open={resetOpen} onOpenChange={setResetOpen}
              className={cn("flex flex-wrap", (isFirstRound || isCancelOpenOrPending) && "opacity-50")}
            >
              <div>
                <h4 id="reset-game-label" className="font-medium text-base">Reset game</h4>
              </div>
              <div className="flex justify-between items-center gap-4 mt-1 w-full">
                <span id="reset-game-desc" className="text-muted-foreground text-sm leading-[1.1rem]">
                  {isFirstRound
                    ? <span>Reset not possible: there is no progress yet</span>
                    : <span><span className="text-secondary-foreground">Caution:</span> Game progress will be lost after resetting the game!</span>
                  }
                </span>
                <CollapsibleTrigger asChild>
                  <Button id="reset-game" aria-describedby="reset-game-desc" aria-labelledby="reset-game-label"
                    variant="secondary" size={isResetPending ? "icon" : "default"}
                    disabled={isResetOrCancelOpenOrPending || isFirstRound || game.status !== "ACTIVE"}
                    onClick={() => setResetOpen(!resetOpen)}
                    className={cn(resetOpen && "has-[>svg]:px-4")}
                  >
                    {isResetPending
                      ? <Loader2Icon className="text-secondary-foreground animate-spin" />
                      : resetOpen ? <ChevronDownIcon className="size-5" /> : "Reset"
                    }
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="w-full">
                <div className="flex justify-between items-center pt-3">
                  <span>Are you sure?</span>
                  <div className="space-x-3">
                    <Button variant="outline" size="icon" onClick={() => setResetOpen(false)}><XIcon /></Button>
                    <Button variant="destructive" size="icon" onClick={handleReset}><CheckIcon /></Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* option - cancel game */}
            <Collapsible
              open={cancelOpen} onOpenChange={setCancelOpen}
              className={cn("flex flex-wrap", isResetOpenOrPending && "opacity-50")}
            >
              <div>
                <h4 id="cancel-game-label" className="font-medium text-base">Cancel game</h4>
              </div>
              <div className="flex justify-between items-center gap-4 mt-1 w-full">
                <span id="cancel-game-desc" className="text-muted-foreground text-sm leading-[1.1rem]"><span className="text-secondary-foreground">Caution:</span> A canceled game cannot be played afterwards!</span>
                <CollapsibleTrigger asChild>
                  <Button id="cancel-game" aria-describedby="cancel-game-desc" aria-labelledby="cancel-game-label"
                    variant="destructive" size={isCancelPending ? "icon" : "default"}
                    disabled={isResetOrCancelOpenOrPending || game.status !== "ACTIVE"}
                    onClick={() => setCancelOpen(true)}
                    className={cn(cancelOpen && "has-[>svg]:px-4")}
                  >
                    {isCancelPending
                      ? <Loader2Icon className="text-primary-foreground animate-spin" />
                      : cancelOpen ? <ChevronDownIcon className="size-5" /> : "Cancel"
                    }
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="w-full">
                <div className="flex justify-between items-center pt-3">
                  <span>Are you sure?</span>
                  <div className="space-x-3">
                    <Button variant="outline" size="icon" onClick={() => setCancelOpen(false)}><XIcon /></Button>
                    <Button variant="destructive" size="icon" onClick={handleCancel}><CheckIcon /></Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>

        </div>
      </DialogContent>
    </Dialog >
  );
}
