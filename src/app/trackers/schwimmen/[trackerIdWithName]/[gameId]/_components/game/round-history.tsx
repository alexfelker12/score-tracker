"use client"

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* components
import { RedoIcon, UndoIcon } from "lucide-react";

//* icons
import { Button } from "@/components/ui/button";


export const RoundHistory = () => {
  //* hooks here
  const {
    game, currentRoundNumber,
    isAction, setCurrentRoundNumber, getLatestRound
  } = useSchwimmenGameStore()

  //* checks
  const isFirstRound = currentRoundNumber === 0
  const isLastRound = getLatestRound().round === currentRoundNumber

  const handleClick = (historyDir: "undo" | "redo") => {
    if (!isAction(ActionStatus.ISIDLE)) return;

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
    <div className="space-x-2">
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
    </div>
  );
}
