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


export const Actions = () => {
  //* hooks here
  const { isAction, setAction, game } = useSchwimmenGameStore()

  //* if any action (create latest round/delete rounds) is pending 
  const isActionPending = useMutationState({
    filters: { mutationKey: ["game", game.id], status: "pending" },
    select: (mutation) => mutation.state.status === "pending",
  })[0];

  return (
    <>
      {/* subtract life */}
      <Button
        size="icon"
        variant="outline"
        disabled={isAction(ActionStatus.ISNUKE) || game.status !== "ACTIVE" || isActionPending}
        onClick={() => {
          if (isAction(ActionStatus.ISSUBTRACT)) {
            setAction(ActionStatus.ISIDLE)
          } else {
            setAction(ActionStatus.ISSUBTRACT)
          }
        }}
      >
        {isAction(ActionStatus.ISSUBTRACT)
          ? isActionPending
            ? <Loader2Icon className="text-primary animate-spin size-5" />
            : <XIcon className="size-5" />
          : <HeartCrackIcon className="size-5" />
        }
      </Button>

      {/* detonate nuke */}
      <Button
        size="icon"
        variant="outline"
        disabled={isAction(ActionStatus.ISSUBTRACT) || game.status !== "ACTIVE" || isActionPending}
        onClick={() => {
          if (isAction(ActionStatus.ISNUKE)) {
            setAction(ActionStatus.ISIDLE)
          } else {
            setAction(ActionStatus.ISNUKE)
          }
        }}
      >
        {isAction(ActionStatus.ISNUKE)
          ? isActionPending
            ? <Loader2Icon className="text-primary animate-spin size-5" />
            : <XIcon className="size-5" />
          : <BombIcon className="size-5" />
        }
      </Button>
    </>
  );
}
