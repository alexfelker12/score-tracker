import { GameLink, type GameLinkProps } from "./_components/game-link";

export default function Trackers() {
  return (
    <main className="flex flex-col gap-6">
      <div>
        {/* heading + description */}
        <h1 className="text-2xl">Trackers</h1>
        <p className="text-muted-foreground text-sm">Explore trackers for different games</p>
      </div>

      {/* games list */}
      <div className="gap-4 grid md:grid-cols-2">
        {GAMES.map((game) => (
          <GameLink key={game.href} {...game} />
        ))}
      </div>
    </main>
  );
}

export const GAMES: GameLinkProps[] = [
  {
    name: "Schwimmen",
    href: "/trackers/schwimmen",
    description: "Achieve the highest amount of points with 3 cards.",
    categories: ["Cards", "2-11 Players"]
  },
]
