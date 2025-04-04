"use client"

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { getTrackerById } from "@/server/actions/tracker/actions";

import { Loader2Icon } from "lucide-react";

import { TrackerDetailsWrapProps } from "./tracker-details-wrap";


export type TrackerDetailsProps = TrackerDetailsWrapProps & {}
export const TrackerDetails = ({ trackerId }: TrackerDetailsProps) => {
  const { data, isPending } = useQuery({
    queryKey: ["trackers", trackerId],
    queryFn: () => getTrackerById(trackerId),
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  if (isPending) return <LoadingTrackerDetails />

  if (!data) return <ErrorMessage />
  if (data.error) return <ErrorMessage error={data.error} />
  if (!data.data) return <InvalidTrackerMessage />

  console.log(data.data.players)

  return (
    <div>
      <p>
        Name: {data.data.displayName}
      </p>
      <div>
        <h3>Player:</h3>
        {data.data.players.map((player) => {
          return (
            <div key={player.id} className="flex gap-2"><span>-</span><span>{player.name}</span></div>
          )
        })}
      </div>
      <div>
        <h3>Games:</h3>
        {data.data.games.length > 0
        ? data.data.games.map((game) => {
          return (
            <div key={game.id} className="flex gap-2"><span>-</span><span>{game.id}</span></div>
          )
        })
        :
        <span className="italic">No games played yet</span>
      }
      </div>
    </div>
  );
}

const LoadingTrackerDetails = () => (
  <div className="flex flex-1 justify-center items-center">
    <Loader2Icon className="text-primary animate-spin size-8" />
  </div>
)
const ErrorMessage = ({ error = "Server Error" }: { error?: unknown }) => (
  <p>
    There was an error loading this tracker:
    {JSON.stringify(error, null, 2)}
  </p>
)
const InvalidTrackerMessage = () => (
  <p>
    This tracker is invalid. Create a new one <Link href="/trackers/schwimmen" className="text-primary">here</Link>.
  </p>
)
