import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";

import { limitCharacters } from "@/lib/utils";
import { GameWrap, LoadingGame } from "./_components/game-wrap";
import { Suspense } from "react";


export default async function TrackerSessionPage({
  params,
}: {
  params: Promise<{ trackerId: string, gameId: string }>
}) {
  const { trackerId, gameId } = await params

  const trackerIdSplits = trackerId.split("-", 2);
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
      href: `/trackers/schwimmen/${trackerId}`
    },
    {
      name: gameIdShort
    }
  ]

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs navTrail={navTrail} />

      <Suspense fallback={<LoadingGame />}>
        <GameWrap gameId={gameId} />
      </Suspense>
    </main>
  );
}
