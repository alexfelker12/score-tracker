//* next/react
import { Suspense } from "react";

//* server
import { getGameById } from "@/server/actions/game/actions";

//* lib
import { limitCharacters } from "@/lib/utils";

//* icons
import { Loader2Icon } from "lucide-react";

//* components
import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";

//* local
import { Game } from "./_components/game/game";


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
          name: "> Schwimmen",
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

type GameWrapParams = {
  trackerId: string
  gameId: string
  trackerPath: string
}
const GameWrap = async (gameParams: GameWrapParams) => {
  const { gameId, trackerId, trackerPath } = gameParams
  // const qc = getQueryClient()
  // await qc.prefetchQuery({
  //   queryKey: ["trackers", trackerId, gameId],
  //   queryFn: () => getGameById(gameId)
  // })

  // await delay(2000)

  const { data: game, error } = await getGameById(gameId)

  if (error) return <ErrorMessage error={error} />
  if (!game) return <ErrorMessage />

  return (
    // <HydrationBoundary
    //   state={dehydrate(qc)}
    // >
    <Game game={game} trackerId={trackerId} trackerPath={trackerPath} />
    // </HydrationBoundary>
  );
}

const LoadingGame = () => (
  <div className="flex flex-1 justify-center items-center">
    <Loader2Icon className="text-primary animate-spin size-8" />
  </div>
)
const ErrorMessage = ({ error = "Server Error" }: { error?: unknown }) => (
  <p>
    There was an error loading this game:
    {JSON.stringify(error, null, 2)}
  </p>
)

