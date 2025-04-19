"use client"

import { Button } from "@/components/ui/button";
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { HeartCrackIcon, BombIcon, XIcon } from "lucide-react";
import React from "react";


export const Actions = () => {
  //* hooks here
  const { isAction, setAction } = useSchwimmenGameStore()

  return (
    <>
      {/* subtract life */}
      <Button
        size="icon"
        variant="outline"
        disabled={isAction(ActionStatus.ISNUKE)}
        onClick={() => {
          if (isAction(ActionStatus.ISSUBTRACT)) {
            setAction(ActionStatus.ISIDLE)
          } else {
            setAction(ActionStatus.ISSUBTRACT)
          }
        }}
      >
        {isAction(ActionStatus.ISSUBTRACT) ? <XIcon className="size-5" /> : <HeartCrackIcon className="size-5" />}
      </Button>

      {/* detonate nuke */}
      <Button
        size="icon"
        variant="outline"
        disabled={isAction(ActionStatus.ISSUBTRACT)}
        onClick={() => {
          if (isAction(ActionStatus.ISNUKE)) {
            setAction(ActionStatus.ISIDLE)
          } else {
            setAction(ActionStatus.ISNUKE)
          }
        }}
      >
        {isAction(ActionStatus.ISNUKE) ? <XIcon className="size-5" /> : <BombIcon className="size-5" />}
      </Button>
    </>
  );
}
