"use client"

//* next/react
import React from "react";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* icons
import { HeartCrackIcon, BombIcon, XIcon, Loader2Icon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { useMutationState } from "@tanstack/react-query";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";
import { SCHWIMMEN_TOP_ICON_SIZE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";


export const Actions = () => {
  //* hooks here
  const { game, isAction, setAction } = useSchwimmenGameStore()
  const { meta } = useSchwimmenMetaStore()

  //* if any action (create latest round/delete rounds) is pending 
  const isActionPending = useMutationState({
    filters: { mutationKey: ["game", game.id], status: "pending" },
    select: (mutation) => mutation.state.status === "pending",
  }).some((pending) => pending);

  return (
    <>
      {/* subtract life */}
      <Button
        size={`game${SCHWIMMEN_TOP_ICON_SIZE_MAP[meta.uiSize[0]]}`}
        variant="gameOutline"
        disabled={isAction(ActionStatus.ISNUKE) || game.status !== "ACTIVE" || isActionPending}
        onClick={() => {
          if (isAction(ActionStatus.ISSUBTRACT)) {
            setAction(ActionStatus.ISIDLE)
          } else {
            setAction(ActionStatus.ISSUBTRACT)
          }
        }}
        className={cn(
          "transition-[width,height,border-color] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200",
          (isAction(ActionStatus.ISSUBTRACT) && !isActionPending) && "border-muted-foreground"
        )}
      >
        {isAction(ActionStatus.ISSUBTRACT)
          ? isActionPending
            ? <Loader2Icon className="text-primary !animate-spin size-5" />
            : <XIcon className="size-5" />
          : <HeartCrackIcon className="size-5" />
        }
      </Button>

      {/* detonate nuke */}
      <Button
        size={`game${SCHWIMMEN_TOP_ICON_SIZE_MAP[meta.uiSize[0]]}`}
        variant="gameOutline"
        disabled={isAction(ActionStatus.ISSUBTRACT) || game.status !== "ACTIVE" || isActionPending}
        onClick={() => {
          if (isAction(ActionStatus.ISNUKE)) {
            setAction(ActionStatus.ISIDLE)
          } else {
            setAction(ActionStatus.ISNUKE)
          }
        }}
        className={cn(
          "transition-[width,height,border-color] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200",
          (isAction(ActionStatus.ISNUKE) && !isActionPending) && "border-muted-foreground"
        )}
      >
        {isAction(ActionStatus.ISNUKE)
          ? isActionPending
            ? <Loader2Icon className="text-primary !animate-spin size-5" />
            : <XIcon className="size-5" />
          : <BombIcon className="size-5" />
        }
      </Button>
    </>
  );
}
