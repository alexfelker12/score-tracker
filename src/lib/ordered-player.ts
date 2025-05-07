import { SchwimmenRound } from "prisma/json_types/types"

export class OrderedPlayer {
  #jsonPlayer: SchwimmenRound["players"][0]
  #nextPlayer: OrderedPlayer | undefined

  constructor(jsonPlayer: SchwimmenRound["players"][0], nextPlayer: OrderedPlayer | undefined
    = undefined) {
    this.#jsonPlayer = jsonPlayer
    this.#nextPlayer = nextPlayer
  }

  getJsonPlayer(): SchwimmenRound["players"][0] {
    return this.#jsonPlayer
  }

  setNextPlayer(nextPlayer: OrderedPlayer) {
    this.#nextPlayer = nextPlayer
  }

  getNextPlayer(): OrderedPlayer | undefined {
    return this.#nextPlayer
  }

  returnIfAlive(): OrderedPlayer | undefined {
    if (this.#jsonPlayer.lifes < 1) {
      return this.#nextPlayer && this.#nextPlayer.returnIfAlive()
    }
    return this
  }
}