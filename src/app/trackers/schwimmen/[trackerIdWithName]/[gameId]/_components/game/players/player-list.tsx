"use client"

//* packages
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { SchwimmenRound } from "prisma/json_types/types";

//* server
import { createLatestRoundForGame, deleteRoundsFromRoundNumber } from "@/server/actions/game/roundData/actions";
import { tryCatch } from "@/server/helpers/try-catch";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* hooks
import { useConfirmation } from "@/hooks/use-confirmation";
import { Player, PlayerProps } from "./player";


export const PlayerList = () => {
  //* hooks here
  const {
    action, game, currentRoundNumber, rounds,
    setAction, getRound, setCurrentRoundNumber, setRounds, setLatestSyncedRounds, getPlayer, subtractLifeOf, addRound, getLatestRound, checkNukeForConflict, detonateNuke,
  } = useSchwimmenGameStore()
  // const { meta } = useSchwimmenMetaStore()
  const { showConfirmation } = useConfirmation()

  //* mutations for actions
  //* POST round  // , isPending: isLatestRoundPending
  const { mutate: createLatestRound } = useMutation({
    mutationKey: ["game", game.id, "create"],
    mutationFn: createLatestRoundForGame,
  })
  //* DELETE rounds  // , isPending: isDeleteRoundsPending
  const { mutate: deleteRoundsFrom } = useMutation({
    mutationKey: ["game", game.id, "delete"],
    mutationFn: deleteRoundsFromRoundNumber,
  })

  //* current round
  const current = getRound(currentRoundNumber)

  //* round dependent action
  const handleNewRound = (newRoundData: SchwimmenRound) => {
    //* optimistically add new round, error cases are handled below 
    const updatedRounds = addRound(newRoundData)

    const handleCreateLatestRound = () => {
      createLatestRound({ gameId: game.id, roundNumber: currentRoundNumber + 1, data: newRoundData }, {
        onSettled: (data) => {
          //* only successful for unfinished games
          if (data && data.data) {
            if (updatedRounds) setLatestSyncedRounds(updatedRounds)
          } else {
            //* in case of an error from rq or backend: set rounds back to state before optimistic update
            setCurrentRoundNumber(rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current).round)
            setRounds(rounds)
          }
          setAction(ActionStatus.ISIDLE)
        }
      })
    }

    //* if current round is not the latest round first delete rounds greater than current round
    if (getLatestRound().round > currentRoundNumber) {
      deleteRoundsFrom({ gameId: game.id, roundNumber: currentRoundNumber }, {
        onSettled: (data) => {
          //* only successful for unfinished games
          if (data && data.data) {
            handleCreateLatestRound()
          } else {
            //* in case of an error from rq or backend: set rounds back to state before optimistic update
            setCurrentRoundNumber(rounds.reduce((prev, current) => prev && prev.round > current.round ? prev : current).round)
            setRounds(rounds)
            setAction(ActionStatus.ISIDLE)
          }
        }
      })
    } else {
      //* else no rounds have to be deleted and latest round can simply be created
      handleCreateLatestRound()
    }
  }

  //* click handler for all action states
  const handleClick = async (playerId: string, delay: number = 0) => {
    switch (action) {
      case ActionStatus.ISSUBTRACT:
        const newRoundData = subtractLifeOf(playerId)

        if (!newRoundData) {
          setAction(ActionStatus.ISIDLE)
          return
        }

        if (delay > 0) {
          setTimeout(() => handleNewRound(newRoundData), delay)
        } else {
          handleNewRound(newRoundData)
        }
        break

      case ActionStatus.ISNUKE:
        //* playerId is detonator
        //* returns players in case of conflict, else undefined
        const affectedPlayers = checkNukeForConflict(playerId)

        if (affectedPlayers) {

          //* case 1: 2 or more players would be swimming -> conflict
          if (affectedPlayers.length >= 2) {
            //* get surviving player from conflict dialog, in case of error, log and set back to idle
            const { data: survivingPlayer, error } = await tryCatch(showConfirmation(affectedPlayers))
            if (error) { console.error("Error during confirmation:", error); setAction(ActionStatus.ISIDLE); return; }

            //* do action
            const newRoundData = detonateNuke(playerId, survivingPlayer.id)
            if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }
            if (delay > 0) {
              setTimeout(() => handleNewRound(newRoundData), delay)
            } else {
              handleNewRound(newRoundData)
            }

            //* case 2: only 1 player would be swimming -> NO conflict
          } else if (affectedPlayers.length === 1) {
            //* do action
            const newRoundData = detonateNuke(playerId, affectedPlayers[0].id) // 0 exists because length === 1 check is true
            if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }
            if (delay > 0) {
              setTimeout(() => handleNewRound(newRoundData), delay)
            } else {
              handleNewRound(newRoundData)
            }
          }

        } else {
          //* if no conflict, just pass playerId
          const newRoundData = detonateNuke(playerId)
          if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }

          if (delay > 0) {
            setTimeout(() => handleNewRound(newRoundData), delay)
          } else {
            handleNewRound(newRoundData)
          }
        }
        break

      case ActionStatus.ISIDLE:
      // basically do nothing
      //? what was this for and why is it in the idle case?
      //* after every action check if win condition is met (only one player alive)
      // checkWinCondition()
    }
  }

  // const amountDeadPlayers = current ? current.data.players.filter((player) => player.lifes < 1).length : 0


  if (current) return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {current.data.players.map((jsonPlayer) => {
          // if (meta.hideDead && jsonPlayer.lifes < 1) return;

          const player = getPlayer(jsonPlayer.id)!
          const playerProps: PlayerProps = {
            player: player,
            lifes: jsonPlayer.lifes,
            isSwimming: current.data.playerSwimming === jsonPlayer.id,
            // isWinner: false
          }
          return (
            <Player
              key={jsonPlayer.id}
              onClick={() => handleClick(jsonPlayer.id)}
              // initial={{ scale: 0.8, opacity: 0 }}
              // animate={{ scale: 1, opacity: 1 }}
              // exit={{ scale: 0.8, opacity: 0 }}
              // layout
              {...playerProps}
            />
          )
        })}
      </AnimatePresence>

      {/* {(meta.hideDead && amountDeadPlayers > 0) && <span className="text-muted-foreground text-sm italic">
        {amountDeadPlayers} player{amountDeadPlayers > 1 ? "s" : ""} hidden
      </span>} */}
    </div>
  );
}
