"use client"

import { Button } from "@/components/ui/button";
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { RedoIcon, UndoIcon } from "lucide-react";


export const RoundHistory = () => {
  //* hooks here
  const { isAction, currentRoundNumber, setCurrentRoundNumber, getLatestRound } = useSchwimmenGameStore()

  //* checks
  const isFirstRound = currentRoundNumber === 0
  const isLastRound = getLatestRound().round === currentRoundNumber

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
