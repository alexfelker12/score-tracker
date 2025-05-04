"use client"

//* next/react
import React from "react";

//* packages
import { useMutation } from "@tanstack/react-query";

//* server
import { FindGameByIdReturn, updateGameStatusAndData } from "@/server/actions/game/actions";

//* stores
import { GameParticipantWithUser, Round, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* lib
import { getQueryClient } from "@/lib/get-query-client";

//* local
import { ConflictDialog } from "./dialogs/conflict-dialog";
import { FinishedGame } from "./dialogs/finished-game";
import { PlayerList } from "./players/player-list";
import { Actions } from "./top/actions";
import { RoundHistory } from "./top/round-history";
import { Settings } from "./top/settings";

//* temporary
import { Loader2Icon } from "lucide-react";
import { LayoutGroup } from "motion/react";
import { LastActionDialog } from "./dialogs/last-action-dialog";
// import { tryCatch } from "@/server/helpers/try-catch";
// import { useConfirmation } from "@/hooks/use-confirmation";


export type GameParams = {
  game: NonNullable<FindGameByIdReturn>
  trackerId: string
  trackerPath: string
}
export const Game = (params: GameParams) => {
  const { game, trackerId, trackerPath } = params

  //* hooks here
  const {
    ready, game: storeGame, latestSyncedRounds,
    init, checkWinCondition, finishGame, getLatestRound
  } = useSchwimmenGameStore()
  // const { showConfirmation } = useConfirmation()

  //* initialize game
  React.useEffect(() => {
    init({
      ready: true,
      game: game,
      players: game.participants.filter((player): player is GameParticipantWithUser => true),
      rounds: game.rounds.filter((round): round is Round => round.data.type === "SCHWIMMEN"),
      latestSyncedRounds: game.rounds.filter((round): round is Round => round.data.type === "SCHWIMMEN"),
      //* default latest round
      currentRoundNumber: game.rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current).round,
    })
  }, [useSchwimmenGameStore])

  //* on game finish, update game status
  React.useEffect(() => {
    const checkFinishCondition = async () => {
      const winningPlayer = checkWinCondition()
      const lastRound = getLatestRound()

      if (!winningPlayer) return;

      //TODO: here conflict dialog to ask if finishing action is correct
      // const { data: survivingPlayer, error } = await tryCatch(showConfirmation(affectedPlayers))
      // if (error) return
      //? incorrect now. Probably use another store or refactor confirmation store something like this...


      //* update game status to "COMPLETED"
      updateGame({
        gameId: game.id,
        newStatus: "COMPLETED",
        gameData: {
          type: "SCHWIMMEN",
          swimming: lastRound.data.playerSwimming!,
          winByNuke: lastRound.data.nukeBy !== "" && lastRound.data.nukeBy !== undefined,
          winner: winningPlayer.id
        }
      }, {
        onSettled: (data) => {
          if (data && data.data) {
            qc.invalidateQueries({ queryKey: ["trackers", trackerId] })
            finishGame("COMPLETED")
          }
        }
      })
    }
    if (ready && storeGame.status === "ACTIVE" && game.status === "ACTIVE") checkFinishCondition();
  }, [ready, latestSyncedRounds])

  //* PUT game status
  // isPending: isStatusUpdatePending
  const qc = getQueryClient()
  const { mutate: updateGame } = useMutation({
    mutationFn: updateGameStatusAndData,
  })

  // TODO: create proper loading ui (skeletons, etc...). This is placeholder atm
  if (!ready) return <div className="flex flex-1 justify-center items-center">
    <Loader2Icon className="text-primary animate-spin size-8" />
  </div>

  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex justify-between items-center gap-4" aria-description="Game actions and settings">
        {/* settings & history */}
        <div className="flex gap-x-4">
          <Settings />
          <RoundHistory />
        </div>

        {/* actions */}
        <div className="space-x-2">
          <Actions />
        </div>
      </section>

      <LayoutGroup>
        <section aria-description="Player list">
          <PlayerList />
        </section>

        <ConflictDialog />

        {(ready && storeGame.status !== "ACTIVE") && <FinishedGame trackerPath={trackerPath} />}
      </LayoutGroup>
    </div>
  );
}
