"use client"

//* next/react
import React from "react";

//* packages
import { GameRound } from "@prisma/client";
import { SchwimmenRound } from "prisma/json_types/types";
import { useMutation } from "@tanstack/react-query";

//* server
import { FindGameByIdReturn, updateGameStatusAndData } from "@/server/actions/game/actions";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* lib
import { getQueryClient } from "@/lib/get-query-client";

//* local
import { LoadingGame } from "../game-wrap";
import { Actions } from "./actions";
import { ConflictDialog } from "./conflict-dialog";
import { FinishedGameDialog } from "./finished-game-dialog";
import { PlayerList } from "./player-list";
import { RoundHistory } from "./round-history";
import { Settings } from "./settings";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";

export type GameParams = {
  game: NonNullable<FindGameByIdReturn>
  trackerId: string
  trackerPath: string
}
export const Game = (params: GameParams) => {
  const { game, trackerId, trackerPath } = params

  console.log(trackerId)

  //* hooks here
  const {
    ready, currentRoundNumber, game: thisGame, rounds,
    init, getPlayer, getCurrentRound, checkWinCondition, finishGame, getLatestRound
  } = useSchwimmenGameStore()

  //* initialize game
  React.useEffect(() => {
    init({
      ready: true,
      game: game,
      players: game.participants,
      rounds: game.rounds.filter((round): round is Omit<GameRound, "data"> & { data: SchwimmenRound } => round.data.type === "SCHWIMMEN"),
      action: ActionStatus.ISIDLE,
      //* default latest round
      currentRoundNumber: game.rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current).round,
    })
  }, [useSchwimmenGameStore])

  //* on game finish, update game status
  React.useEffect(() => {
    console.log(ready && thisGame.status === "ACTIVE")
    console.log(thisGame.status)
    if (ready && thisGame.status === "ACTIVE" && game.status === "ACTIVE") {
      const winningPlayer = checkWinCondition("latest")
      const lastRound = getLatestRound()

      if (!winningPlayer) return;

      //* update game status to "COMPLETED"
      updateGame({
        gameId: game.id,
        newStatus: "COMPLETED",
        gameData: {
          type: "SCHWIMMEN",
          swimming: lastRound.data.playerSwimming!,
          winByNuke: !!lastRound.data.nukeBy,
          winner: winningPlayer.id
        }
      }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["trackers", trackerId] })
          finishGame("COMPLETED")
        }
      })
    }
  }, [ready, rounds])

  const qc = getQueryClient()

  //* PUT game status
  // isPending: isStatusUpdatePending
  const { mutate: updateGame } = useMutation({
    mutationFn: updateGameStatusAndData,
  })

  if (!ready) return <LoadingGame />

  return (
    <div className="relative space-y-4">
      {/* show "game is finished dialog" to indicate, that game cannot be further modified/played */}
      {thisGame.status !== "ACTIVE" && <FinishedGameDialog trackerPath={trackerPath} />}

      <section className="flex justify-between items-center gap-4" aria-description="Game actions and settings">

        {/* settings & history */}
        <div className="flex gap-x-4">
          <Settings />
          <RoundHistory />
        </div>

        <span>Round: {currentRoundNumber}</span>

        {/* actions */}
        <div className="space-x-2">
          <Actions />
        </div>

      </section>

      <section aria-description="Player list">
        <PlayerList />
      </section>

      <section>
        Player swimming: {(getPlayer(getCurrentRound().data.playerSwimming || "") || { displayName: "no one yet" }).displayName}
      </section>

      <ConflictDialog />
    </div>
  );
}
