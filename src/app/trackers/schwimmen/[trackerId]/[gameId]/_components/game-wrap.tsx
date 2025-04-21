import { getGameById } from "@/server/actions/game/actions";

import { Loader2Icon } from "lucide-react";
import { Game } from "./game/game";


export type GameWrapParams = {
  trackerId: string
  gameId: string
}
export const GameWrap = async (gameParams: GameWrapParams) => {
  const { gameId, trackerId } = gameParams
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
    <Game game={game} trackerId={trackerId} />
    // </HydrationBoundary>
  );
}

export const LoadingGame = () => (
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
