"use client"

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* components
import { RedoIcon, UndoIcon } from "lucide-react";

//* icons
import { Button } from "@/components/ui/button";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";
import { SCHWIMMEN_ICON_SIZE_MAP } from "@/lib/constants";


export const RoundHistory = () => {
  //* hooks here
  const {
    currentRoundNumber,
    isAction, setCurrentRoundNumber, setPrevRoundNumber, getLatestRound
  } = useSchwimmenGameStore()
  const { meta } = useSchwimmenMetaStore()

  //* checks
  const isFirstRound = currentRoundNumber === 0
  const isLastRound = getLatestRound().round === currentRoundNumber

  const handleClick = (historyDir: "undo" | "redo") => {
    if (!isAction(ActionStatus.ISIDLE)) return;

    switch (historyDir) {
      case "undo":
        if (isFirstRound) return
        setPrevRoundNumber(currentRoundNumber)
        setCurrentRoundNumber(currentRoundNumber - 1)
        break
      case "redo":
        if (isLastRound) return
        setPrevRoundNumber(currentRoundNumber)
        setCurrentRoundNumber(currentRoundNumber + 1)
        break
    }
  }

  return (
    <div className="space-x-2">
      <Button
        size={`game${SCHWIMMEN_ICON_SIZE_MAP[meta.uiSize[0]]}`}
        variant="outline"
        disabled={!isAction(ActionStatus.ISIDLE) || isFirstRound}
        onClick={() => handleClick("undo")}
        className="transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200"
        >
        <UndoIcon className="size-5" />
      </Button>
      <Button
        size={`game${SCHWIMMEN_ICON_SIZE_MAP[meta.uiSize[0]]}`}
        variant="outline"
        disabled={!isAction(ActionStatus.ISIDLE) || isLastRound}
        onClick={() => handleClick("redo")}
        className="transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200"
        >
        <RedoIcon className="size-5" />
      </Button>
    </div>
  );
}
