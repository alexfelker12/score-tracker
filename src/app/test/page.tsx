import { Breadcrumbs } from "@/components/breadcrumbs";
import GameRounds from "../trackers/schwimmen/[trackerIdWithName]/[gameId]/_components/game/players/player-claude";

export default async function Schwimmen() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <GameRounds />
    </main>
  );
}
