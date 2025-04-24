"use client"

//* packages
import { SchwimmenRound } from "prisma/json_types/types";
import { useMutation } from "@tanstack/react-query";

//* server
import { createLatestRoundForGame, deleteRoundsFromRoundNumber } from "@/server/actions/game/roundData/actions";
import { tryCatch } from "@/server/helpers/try-catch";

//* stores
import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* hooks
import { useConfirmation } from "@/hooks/use-confirmation";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";


export const PlayerList = () => {
  //* hooks here
  const {
    action, game, currentRoundNumber,
    setAction, getRound, getPlayer, subtractLifeOf, addRound, getLatestRound, checkNukeConflict, detonateNuke, checkWinCondition
  } = useSchwimmenGameStore()
  const { meta } = useSchwimmenMetaStore()

  const current = getRound(currentRoundNumber)

  const { showConfirmation } = useConfirmation()

  //* mutations for actions
  //* POST round
  // , isPending: isLatestRoundPending
  const { mutate: createLatestRound } = useMutation({
    mutationFn: createLatestRoundForGame,
  })
  //* DELETE rounds
  // , isPending: isDeleteRoundsPending
  const { mutate: deleteRoundsFrom } = useMutation({
    mutationFn: deleteRoundsFromRoundNumber,
  })

  // //* mutation state to display proper loading when doing mutation (from trackers)
  // const isCreatePending = useMutationState({
  //   filters: { mutationKey: ['tracker-create', trackerType], status: 'pending' },
  //   select: (mutation) => mutation.state.status === 'pending',
  // })[0];

  const handleNewRound = (newRoundData: SchwimmenRound) => {
    //* if current round is not the latest round first delete rounds greater than current round
    if (getLatestRound().round > currentRoundNumber) {
      deleteRoundsFrom({ gameId: game.id, roundNumber: currentRoundNumber }, {
        onSettled: (data) => {
          //* only successful for unfinished games
          if (data && data.data) {
            createLatestRound({ gameId: game.id, roundNumber: currentRoundNumber + 1, data: newRoundData }, {
              onSettled: (data) => {
                //* only successful for unfinished games
                if (data && data.data) {
                  addRound(newRoundData)
                }
                setAction(ActionStatus.ISIDLE)
              }
            })
          } else {
            setAction(ActionStatus.ISIDLE)
          }
        }
      })
    } else {
      //* else no rounds have to be deleted and latest round can simply be created
      createLatestRound({ gameId: game.id, roundNumber: currentRoundNumber + 1, data: newRoundData }, {
        onSettled: (data) => {
          //* only successful for unfinished games
          if (data && data.data) {
            addRound(newRoundData)
          }
          setAction(ActionStatus.ISIDLE)
        }
      })
    }
  }

  //* click handler for all action states
  const handleClick = async (playerId: string) => {
    switch (action) {
      case ActionStatus.ISSUBTRACT:
        const newRoundData = subtractLifeOf(playerId)

        if (!newRoundData) {
          setAction(ActionStatus.ISIDLE)
          return
        }

        handleNewRound(newRoundData)
        break

      case ActionStatus.ISNUKE:
        //* returns players in case of conflict, else undefined
        const affectedPlayers = checkNukeConflict(playerId)

        if (affectedPlayers) {
          //* get surviving player from conflict dialog, in case of error, log and set back to idle
          const { data: survivingPlayer, error } = await tryCatch(showConfirmation(affectedPlayers))
          if (error) { console.error("Error during confirmation:", error); setAction(ActionStatus.ISIDLE); return; }

          //* do action
          const newRoundData = detonateNuke(playerId, survivingPlayer.id)
          if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }

          handleNewRound(newRoundData)
        } else {
          //* if no conflict, just pass playerId
          const newRoundData = detonateNuke(playerId)
          if (!newRoundData) { setAction(ActionStatus.ISIDLE); return; }

          handleNewRound(newRoundData)
        }
        break

      case ActionStatus.ISIDLE:
        // basically do nothing

        //* after every action check if win condition is met (only one player alive)
        checkWinCondition()
    }
  }

  return (
    <div className="space-y-2">
      {current.data.players.map((jsonPlayer) => {
        const player = getPlayer(jsonPlayer.id)!
        const remainingLifes = jsonPlayer.lifes
        return (
          <p
            key={jsonPlayer.id}
            onClick={() => handleClick(player.id)}
            className="hover:bg-accent px-2 py-1 border border-primary rounded-lg cursor-pointer"
          >
            {player.displayName} - remaining lifes: {remainingLifes}
          </p>
        )
      })}
      <p>{meta.hideDead ? "hide" : "show"}</p>
      <p>{meta.uiSize}</p>
    </div>
  );
}
