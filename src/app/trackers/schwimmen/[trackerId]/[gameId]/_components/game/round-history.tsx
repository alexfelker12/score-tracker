"use client"

import { Button } from "@/components/ui/button";
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { RedoIcon, UndoIcon } from "lucide-react";

/**
 ** head buttons:
 ** section 1 (left):
 * - go back one round (disable when no presceding round)
 * - go forward one round (disable when no following round)
*/

// TODO Prio 3: go trough rounds backwards and forewards

export type RoundHistoryParams = {

}
export const RoundHistory = (params: RoundHistoryParams) => {
  const { } = params

  //* hooks here
  const { isAction, currentRoundNumber, setCurrentRoundNumber, rounds, getLastRound } = useSchwimmenGameStore()

  //* checks
  const isFirstRound = currentRoundNumber === 0
  const isLastRound = getLastRound().round === currentRoundNumber

  const handleClick = (historyDir: "undo" | "redo") => {
    switch (historyDir) {
      case "undo":
        if (isFirstRound) return
        setCurrentRoundNumber(currentRoundNumber - 1)
        break
      case "redo":
        if (isLastRound) return
        setCurrentRoundNumber(currentRoundNumber + 1)
        break
    }
  }

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        disabled={!isAction(ActionStatus.ISIDLE) || isFirstRound}
        onClick={() => handleClick("undo")}
      >
        <UndoIcon className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        disabled={!isAction(ActionStatus.ISIDLE) || isLastRound}
        onClick={() => handleClick("redo")}
      >
        <RedoIcon className="size-5" />
      </Button>
    </>
  );
}
