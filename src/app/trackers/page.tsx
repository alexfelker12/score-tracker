import { GAMES } from "@/lib/constants";
import { GameLink } from "./_components/game-link";

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
