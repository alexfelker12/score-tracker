import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";

import { limitCharacters } from "@/lib/utils";
import { GameWrap, LoadingGame } from "./_components/game-wrap";
import { Suspense } from "react";


export default async function GamePage({
  params,
}: {
  params: Promise<{ trackerIdWithName: string, gameId: string }>
}) {
  const { trackerIdWithName, gameId } = await params

  const trackerIdSplits = trackerIdWithName.split("-", 2);
  const trackerId = trackerIdSplits[0]
  const trackerName = decodeURIComponent(trackerIdSplits[1])
  const trackerNameShort = limitCharacters(trackerName, 15) || "Tracker"
  const gameIdShort = limitCharacters(gameId, 5) || "Game"

  const navTrail: BreadcrumbType[] = [
    {
      dropdown: true,
      dropdownCrumbs: [
        {
          name: "Trackers",
          href: "/trackers"
        },
        {
          name: "Schwimmen",
          href: "/trackers/schwimmen"
        }
      ]
    },
    {
      name: trackerNameShort,
      href: `/trackers/schwimmen/${trackerIdWithName}`
    },
    {
      name: gameIdShort
    }
  ]

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs navTrail={navTrail} />

      <Suspense fallback={<LoadingGame />}>
        <GameWrap gameId={gameId} trackerId={trackerId} trackerPath={trackerIdWithName} />
      </Suspense>
    </main>
  );
}
