"use client"

import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

/**
 ** main section:
 * listing of players with their current life and indication of the swimming player and dead players (hidden when adjusted in settings)
*/

// TODO Prio 1: list player states and execute functions based on current action

export type PlayerListParams = {

}
export const PlayerList = (params: PlayerListParams) => {
  const { } = params

  //* hooks here
  const { action, isAction, setAction, getRound, getPlayer, currentRoundNumber, subtractLifeOf, addRound } = useSchwimmenGameStore()
  const current = getRound(currentRoundNumber)

  const handleClick = (playerId: string) => {
    switch (action) {
      case ActionStatus.ISSUBTRACT:
        const newRoundData = subtractLifeOf(playerId)

        if (!newRoundData) {
          setAction(ActionStatus.ISIDLE)
          return
        }

        addRound(newRoundData)
        setAction(ActionStatus.ISIDLE)

        break
      case ActionStatus.ISNUKE:
        setAction(ActionStatus.ISIDLE)
        break
      case ActionStatus.ISIDLE:
        console.log("nothing")
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
    </div>
  );
}
