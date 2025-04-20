"use client"

//* next/react
import React from "react";

//* packages
import { GameRound } from "@prisma/client";
import { SchwimmenRound } from "prisma/json_types/types";

//* server
import { FindGameByIdReturn, updateGameStatus } from "@/server/actions/game/actions";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* local
import { LoadingGame } from "../game-wrap";
import { RoundHistory } from "./round-history";
import { Settings } from "./settings";
import { Actions } from "./actions";
import { PlayerList } from "./player-list";
import { ConflictDialog } from "./conflict-dialog";
import { FinishedGameDialog } from "./finished-game-dialog";
import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

export type GameParams = {
  game: NonNullable<FindGameByIdReturn>
  trackerId: string
}
export const Game = (params: GameParams) => {
  const { game, trackerId } = params

  //* hooks here
  const {
    ready,
    currentRoundNumber,
    game: thisGame,
    gameData,
    rounds,
    init,
    getPlayer,
    getCurrentRound,
    checkWinCondition,
    finishGame
  } = useSchwimmenGameStore()

  React.useEffect(() => {
    init({
      ready: true,
      game: game,
      players: game.participants,
      gameData: game.gameData?.data.type === "SCHWIMMEN" ? game.gameData.data : gameData,
      rounds: game.rounds.filter((round): round is Omit<GameRound, "data"> & { data: SchwimmenRound } => round.data.type === "SCHWIMMEN"),
      action: ActionStatus.ISIDLE,
      //* default latest round
      currentRoundNumber: game.rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current).round
    })
  }, [useSchwimmenGameStore])

  React.useEffect(() => {
    if (ready && thisGame.status === "ACTIVE") {
      if (!checkWinCondition("latest")) return; 
      
      //* update game status to "COMPLETED"
      updateStatus({ gameId: game.id, newStatus: "COMPLETED" }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["trackers", trackerId] })
          finishGame()
        }
      })
    }
  }, [ready, rounds])

  const qc = getQueryClient()

  //* PUT game status
  const { mutate: updateStatus, isPending: isStatusUpdatePending } = useMutation({
    mutationFn: updateGameStatus,
  })

  if (!ready) return <LoadingGame />

  // console.log(thisGame, !checkWinCondition("latest"))

  return (
    <div className="relative space-y-4">
      {/* show unclosable "game is finished dialog" to indicate, that game cannot be further modified/played */}
      {thisGame.status !== "ACTIVE" && <FinishedGameDialog />}

      <section className="flex justify-between items-center gap-4">

        {/* settings & history */}
        <div className="flex gap-x-4">
          <Settings />
          <div className="space-x-2">
            <RoundHistory />
          </div>
        </div>

        <span>Round: {currentRoundNumber}</span>

        {/* actions */}
        <div className="space-x-2">
          <Actions />
        </div>

      </section>

      <section>
        <PlayerList />
      </section>

      <section>
        Player swimming: {(getPlayer(getCurrentRound().data.playerSwimming || "") || { displayName: "no one yet" }).displayName}
      </section>

      <ConflictDialog />
    </div>
  );
}
