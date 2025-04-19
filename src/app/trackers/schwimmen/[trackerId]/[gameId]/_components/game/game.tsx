"use client"

//* next/react
import React from "react";

//* packages
import { GameRound } from "@prisma/client";
import { SchwimmenRound } from "prisma/json_types/types";

//* server
import { FindGameByIdReturn } from "@/server/actions/game/actions";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* local
import { LoadingGame } from "../game-wrap";
import { RoundHistory } from "./round-history";
import { Settings } from "./settings";
import { Actions } from "./actions";
import { PlayerList } from "./player-list";
import { ConflictDialog } from "./conflict-dialog";

export type GameParams = {
  game: NonNullable<FindGameByIdReturn>
}
export const Game = (params: GameParams) => {
  const { game } = params

  //* hooks here
  const { init, ready, currentRoundNumber, getPlayer, gameData, rounds, getCurrentRound } = useSchwimmenGameStore()


  React.useEffect(() => {
    init({
      ready: true,
      game: game,
      players: game.participants,
      gameData: game.gameData?.data.type === "SCHWIMMEN" ? game.gameData.data : {
        type: "SCHWIMMEN",
        swimming: "",
        winner: "",
        winByNuke: false
      },
      rounds: game.rounds.filter((round): round is Omit<GameRound, "data"> & { data: SchwimmenRound } => round.data.type === "SCHWIMMEN"),
      action: ActionStatus.ISIDLE,
      //* default latest round
      currentRoundNumber: game.rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current).round
    })
  }, [useSchwimmenGameStore])

  // TODO: build new schwimmen overlay
  if (!ready) return <LoadingGame />

  // console.log("rounds:", rounds)

  return (
    <div className="space-y-4">
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
