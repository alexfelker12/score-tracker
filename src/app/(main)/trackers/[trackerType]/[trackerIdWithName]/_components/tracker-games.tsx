"use client"

import { ItemGroup } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard } from "@/components/ui/trackers/game-cards/_game-card";
import { FindTrackerByIdReturnGame } from "@/server/actions/tracker/actions";
import { GameStatus } from "@prisma/client";

export type TrackerGamesProps = {
  games: FindTrackerByIdReturnGame[]
}
export const TrackerGames = ({ games }: TrackerGamesProps) => {

  const activeGames: FindTrackerByIdReturnGame[] = []
  const completedGames: FindTrackerByIdReturnGame[] = []
  const canceledGames: FindTrackerByIdReturnGame[] = []

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
          ?
          <ItemGroup className="gap-y-1">
            {activeGames.map((game) => <GameCard key={game.id} game={game} />)}
          </ItemGroup>
          :
          <NoGamesNotice status="ACTIVE" />
        }
      </TabsContent>

      <TabsContent value="completed">
        {completedGames.length > 0
          ?
          <ItemGroup className="gap-y-1">
            {completedGames.map((game) => <GameCard key={game.id} game={game} />)}
          </ItemGroup>
          :
          <NoGamesNotice status="COMPLETED" />
        }
      </TabsContent>

      <TabsContent value="canceled">
        {canceledGames.length > 0
          ?
          <ItemGroup className="gap-y-1">
            {canceledGames.map((game) => <GameCard key={game.id} game={game} />)}
          </ItemGroup>
          :
          <NoGamesNotice status="CANCELLED" />
        }
      </TabsContent>
    </Tabs>
  );
}

type NoGamesNoticeProps = {
  status: GameStatus
}
const NoGamesNotice = ({ status }: NoGamesNoticeProps) => {
  const lowerCaseStatus = status.toLowerCase()
  return (
    <span className="flex justify-center p-2 border rounded-md text-muted-foreground text-sm">
      Currently no {lowerCaseStatus} games
    </span>
  );
}