//* Schwimmen
export type SchwimmenGame = {
  type: "SCHWIMMEN"
  winner: string
  swimming: string
  winByNuke: boolean
}

export type SchwimmenRound = {
  type: "SCHWIMMEN"
  players: {
    id: string
    lifes: number
  }[]
  playerSwimming: string | undefined
  nukeBy?: string
}

//* Durak
type DurakGame = {
  type: "DURAK"
  loser: string
}

type DurakRound = {
  type: "DURAK"
}

//* json types
declare global {
  namespace PrismaJson {
    type GameData = SchwimmenGame | DurakGame
    type RoundData = SchwimmenRound | DurakRound
  }
}
