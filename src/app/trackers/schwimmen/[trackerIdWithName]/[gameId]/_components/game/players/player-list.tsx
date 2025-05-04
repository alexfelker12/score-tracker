"use client"

//* next/react
import React from "react";

//* packages
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { SchwimmenRound } from "prisma/json_types/types";

//* server
import { createLatestRoundForGame, deleteRoundsFromRoundNumber } from "@/server/actions/game/roundData/actions";
import { tryCatch } from "@/server/helpers/try-catch";

//* stores
import { ActionStatus, Round, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";

//* hooks
import { useLastActionConfirmation, useNukeConfirmation } from "@/hooks/use-confirmation";

//* local
import { Player, PlayerProps } from "./player";


export const PlayerList = () => {
  //* hooks here
  const {
    action, game, currentRoundNumber, rounds,
    setAction, getRound, setCurrentRoundNumber, setRounds, setLatestSyncedRounds, getPlayer, subtractLifeOf, addRound, getLatestRound, checkNukeForConflict, detonateNuke, checkWinConditionForGameData
  } = useSchwimmenGameStore()
  const { meta } = useSchwimmenMetaStore()
  const { showNukeConfirmation } = useNukeConfirmation()
  const { showLastActionConfirmation } = useLastActionConfirmation()
  const [scope, animate] = useAnimate()

  React.useEffect(() => {
    //* pulse effect when action is currently not IDLE
    if (isNotIdle()) {
      if (!current) return

      current.data.players.forEach((jsonPlayer) => {
        //* no action/animation when dead 
        if (jsonPlayer.lifes > 0) animatePulse(jsonPlayer.id)
      })

    } else {
      if (scope.animations.length > 0) animateDefault()
    }
  }, [action])

  const current = getRound(currentRoundNumber)

  //* mutations for actions
  //* POST round
  const { mutate: createLatestRound, isPending: isLatestRoundPending } = useMutation({
    mutationKey: ["game", game.id, "create"],
    mutationFn: createLatestRoundForGame,
  })
  //* DELETE rounds
  const { mutate: deleteRoundsFrom, isPending: isDeleteRoundsPending } = useMutation({
    mutationKey: ["game", game.id, "delete"],
    mutationFn: deleteRoundsFromRoundNumber,
  })

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
    if (!current || isLatestRoundPending || isDeleteRoundsPending) return;

    const checkForRoundWin = async (newRoundData: SchwimmenRound, playersHit: string[]) => {
      const winningPlayer = checkWinConditionForGameData(newRoundData)

      if (winningPlayer) {
        const { data: confirmed, error } = await tryCatch(showLastActionConfirmation(winningPlayer))
        if (error || !confirmed) {
          setAction(ActionStatus.ISIDLE)
          return
        }

        executeNewRound(newRoundData, playersHit)
      } else {
        executeNewRound(newRoundData, playersHit)
      }
    }

    const executeNewRound = (newRoundData: SchwimmenRound, playersHit: string[]) => {
      //* hit animation
      playersHit.forEach((playerId) => {
        //* direct hit animation
        animateShake(playerId)
        animateBorderRed(playerId)

        setTimeout(() => {
          //* reset/unset after hit duration
          animateDefault(playerId)
          animateBorderUnset(playerId)
        }, getAnimationProps("shake")["options"].duration * 1000)
      })

      //* animation stop for other players
      current.data.players.filter((player) => !playersHit.includes(player.id)).forEach((otherPlayer) => {
        if (otherPlayer.lifes > 0 && scope.animations.length > 0) animateDefault(otherPlayer.id)
      })

      //* execute of 
      if (delay > 0) {
        setTimeout(() => handleNewRound(newRoundData), delay)
      } else {
        handleNewRound(newRoundData)
      }
    }

    switch (action) {
      case ActionStatus.ISSUBTRACT:
        const [newRoundData, playersHit] = subtractLifeOf(playerId)

        if (!newRoundData) {
          setAction(ActionStatus.ISIDLE)
          return
        }

        checkForRoundWin(newRoundData, playersHit)
        break

      case ActionStatus.ISNUKE:
        //* playerId is detonator
        //* returns players in case of conflict, else undefined
        const affectedPlayers = checkNukeForConflict(playerId)

        if (affectedPlayers) {

          if (affectedPlayers.length >= 2) {
            //* case 1: 2 or more players would be swimming -> conflict

            //* get surviving player from conflict dialog, in case of error, log and set back to idle
            const { data: survivingPlayer, error } = await tryCatch(showNukeConfirmation(affectedPlayers))
            if (error) { console.error("Error during confirmation:", error); setAction(ActionStatus.ISIDLE); return; }

            //* do action
            const [newRoundData, playersHit] = detonateNuke(playerId, survivingPlayer.id)
            if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }

            checkForRoundWin(newRoundData, playersHit)
          } else if (affectedPlayers.length === 1) {
            //* case 2: only 1 player would be swimming -> NO conflict
          } else if (affectedPlayers.length === 1) {
            //* case 2: only 1 player would be swimming -> NO conflict

            //* do action
            const [newRoundData, playersHit] = detonateNuke(playerId, affectedPlayers[0].id) // 0 exists because length === 1 check is true
            if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }

            checkForRoundWin(newRoundData, playersHit)
          }

        } else {
          //* if no conflict, just pass playerId
          const [newRoundData, playersHit] = detonateNuke(playerId)
          if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }

          checkForRoundWin(newRoundData, playersHit)
        }
        break

      case ActionStatus.ISIDLE:
      default:
    }
  }


  React.useEffect(() => {
    //* pulse effect when action is currently not IDLE
    if (isNotIdle()) {
      if (!current) return

      current.data.players.forEach((jsonPlayer) => {
        //* no action/animation when dead 
        if (jsonPlayer.lifes > 0) animatePulse(jsonPlayer.id)
      })

    } else {
      if (scope.animations.length > 0) animateDefault()
    }
  }, [action])


  //* animation functions
  const isNotIdle = () => {
    switch (action) {
      case ActionStatus.ISSUBTRACT:
      case ActionStatus.ISNUKE:
        return true
      default:
        return false
    }
  }
  const getAnimationProps = (type: "pulse" | "shake" | "default") => {
    switch (type) {
      case "pulse":
        return {
          keyframes: {
            scale: [1, 1.02, 1],
          },
          options: {
            duration: 2,
            repeat: Infinity,
          },
        };
      case "shake":
        return {
          keyframes: {
            x: [0, -2, 4, -2, 0],
            y: [0, 1, 0, -1, 0],
          },
          options: {
            duration: 0.3,
          },
        };
      default:
        return {
          keyframes: { scale: 1, x: 0, y: 0 },
          options: { duration: 0.2 },
        };
    }
  }
  const animateShake = (playerId: string) => {
    animate(`#player-${playerId}`, { ...getAnimationProps("shake")["keyframes"] }, { ...getAnimationProps("shake")["options"] }) // player card
  }
  const animatePulse = (playerId?: string) => {
    animate(playerId ? `#player-${playerId}` : ".player-card", { ...getAnimationProps("pulse")["keyframes"] }, { ...getAnimationProps("pulse")["options"] }) // player card
  }
  const animateDefault = (playerId?: string) => {
    animate(playerId ? `#player-${playerId}` : ".player-card", { ...getAnimationProps("default")["keyframes"] }, { ...getAnimationProps("default")["options"] }) // player card
  }
  const animateBorderRed = (playerId: string) => {
    animate(`#player-${playerId} .player-border`, { backgroundColor: "red" }) // player border
  }
  const animateBorderUnset = (playerId: string) => {
    animate(`#player-${playerId} .player-border`, { backgroundColor: "" }) // player border
  }


  if (current) return (
    <div className="flex flex-col gap-2" ref={scope}>
      <AnimatePresence>
        {current.data.players.map((jsonPlayer) => {
          if (meta.hideDead && jsonPlayer.lifes < 1) return;

          const player = getPlayer(jsonPlayer.id)!
          const playerProps: PlayerProps = {
            player: player,
            lifes: jsonPlayer.lifes,
            isSwimming: current.data.playerSwimming === jsonPlayer.id,
            isNotIdle: isNotIdle(),
            isWinner: current.data.players.filter((roundPlayer) => roundPlayer.lifes > 0).length === 1 && jsonPlayer.lifes > 0
          }
          return (
            <Player
              key={jsonPlayer.id}
              id={`player-${jsonPlayer.id}`}
              onClick={() => handleClick(jsonPlayer.id, (jsonPlayer.lifes <= 1 && current.data.playerSwimming) ? 300 : 0)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              {...playerProps}
            />
          )
        })}
      </AnimatePresence>

      {/* hidden dead player count */}
      <AnimatePresence>{meta.hideDead && <HiddenPlayerCount currentRound={current} />}</AnimatePresence>
    </div>
  );
}

const HiddenPlayerCount = ({ currentRound }: { currentRound: Round | undefined }) => {
  const amountDeadPlayers = currentRound ? currentRound.data.players.filter((player) => player.lifes < 1).length : 0

  if (amountDeadPlayers > 0) return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ bounce: false, duration: 0.3, ease: "easeInOut" }}
      className="z-0 w-fit text-muted-foreground text-sm italic"
      layout
    >
      {amountDeadPlayers} player{amountDeadPlayers > 1 ? "s" : ""} hidden
    </motion.span>
  );
}
