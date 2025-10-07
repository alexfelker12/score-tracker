"use client"

import { Item } from "@/components/ui/item"
import { FindTrackerByIdReturnGame } from "@/server/actions/tracker/actions"
import { SchwimmenGameCard } from "./schwimmen-game-card"

export type GameCardProps = {
  game: FindTrackerByIdReturnGame
}
export const GameCard = ({ game }: GameCardProps) => {
  switch (game.tracker.type) {
    case "SCHWIMMEN":
      return <SchwimmenGameCard game={game} />
    case "DURAK":
      return <Item>No details yes</Item>
  }
}
