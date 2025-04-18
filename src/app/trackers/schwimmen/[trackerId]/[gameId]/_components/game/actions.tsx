"use client"

import { Button } from "@/components/ui/button";
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { HeartCrackIcon, BombIcon, XIcon } from "lucide-react";
import React from "react";

/**
 ** section 2 (right):
 * - subtract life button:
 * - detonate nuke button:
 *   - after click, visual indication for players to be clickable
 *   - display "x"-icon
 *   - after click on player do action
*/

// TODO Prio 2: subtract life and detonate nuke (core actions)

export type ActionsParams = {

}

export const Actions = (params: ActionsParams) => {
  const { } = params

  //* hooks here
  const isAction = useSchwimmenGameStore((state) => state.isAction)
  const setAction = useSchwimmenGameStore((state) => state.setAction)

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
