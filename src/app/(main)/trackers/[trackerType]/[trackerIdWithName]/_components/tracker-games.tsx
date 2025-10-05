"use client"

//* next/react
import Link from "next/link";
import React from "react";

//* packages

//* server
import { FindTrackerByIdReturnGames } from "@/server/actions/tracker/actions";

//* lib
import { timeElapsed } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//* icons

//* components

//* local

export type TrackerGamesProps = {
  games: FindTrackerByIdReturnGames
}
export const TrackerGames = ({ games }: TrackerGamesProps) => {

  const activeGames: typeof games = []
  const completedGames: typeof games = []
  const canceledGames: typeof games = []

  games.forEach((game) => {
    switch (game.status) {
      case "ACTIVE":
        activeGames.push(game)
        break
      case "COMPLETED":
        completedGames.push(game)
        break
      case "CANCELLED":
        canceledGames.push(game)
        break
    }
  })

  // React.useMemo(() => {
  // }, [games])
  // ^ probably don't need this with react 19?

  return (
    <Tabs defaultValue="active">
      {/* tabs */}
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="canceled">Canceled</TabsTrigger>
      </TabsList>

      {/* content */}
      <TabsContent value="active">
        {activeGames.length > 0
          ? activeGames.map((game) => <GameCard key={game.id} game={game} />)
          : <span className="flex justify-self-center p-2 text-muted-foreground text-sm">Currently no active games</span>
        }
      </TabsContent>

      <TabsContent value="completed">
        {completedGames.length > 0
          ? completedGames.map((game) => <GameCard key={game.id} game={game} />)
          : <span className="flex justify-self-center p-2 text-muted-foreground text-sm">Currently no completed games</span>
        }
      </TabsContent>

      <TabsContent value="canceled">
        {canceledGames.length > 0
          ? canceledGames.map((game) => <GameCard key={game.id} game={game} />)
          : <span className="flex justify-self-center p-2 text-muted-foreground text-sm">Currently no canceled games</span>
        }
      </TabsContent>
    </Tabs>
  );
}

type GameCardProps = {
  game: FindTrackerByIdReturnGames[number]
}
const GameCard = ({ game }: GameCardProps) => {
  return (
    <div
      className="flex flex-wrap justify-between gap-x-2 mb-2"
    >
      <span className="space-x-2">
        <span>-</span>
        <Link href={`/trackers/schwimmen/${encodeURIComponent(game.tracker.id) + "-" + game.tracker.displayName}/${game.id}`}>
          {game.id}
        </Link>
      </span>
      <span className="ml-[calc(6.41px+.5rem)] text-muted-foreground text-sm">{timeElapsed(game.createdAt)}</span>
    </div>
  );
}
