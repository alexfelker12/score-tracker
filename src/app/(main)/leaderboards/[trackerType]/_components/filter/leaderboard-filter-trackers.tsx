"use client"

import { TrackerType } from "@prisma/client";

import { useLeaderboardTrackersQuery } from "@/hooks/use-leaderboard-trackers-query";

import { AlertCircleIcon } from "lucide-react";

//* components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { ErrorMessage, LoadingSpinner } from "../leaderboard";


type LeaderboardFilterTrackersProps = {
  trackerType: TrackerType
}
export const LeaderboardFilterTrackers = ({ trackerType }: LeaderboardFilterTrackersProps) => {
  const { data, isFetching } = useLeaderboardTrackersQuery({ trackerType })

  if (isFetching) return <LoadingSpinner />
  if (data && data.error) return <ErrorMessage message="There was an error loading trackers for this leaderboard" />
  if (data && !data.data.length) return <NoTrackersFound />

  if (data && data.data) return (
    data.data.map((tracker) => (
      <ToggleGroupItem
        key={tracker.id}
        value={tracker.id}
        aria-label={tracker.displayName}
        className="justify-between !bg-inherit hover:bg-inherit p-2 border-2 border-muted data-[state=on]:border-primary rounded-md h-auto !text-accent-foreground"
      >
        <div className="flex flex-col items-start">
          <span>{tracker.displayName}</span>
          <span className="!text-muted-foreground">
            {tracker._count.players} player{tracker._count.players === 1 ? "" : "s"}
          </span>
        </div>
        <span className="!text-muted-foreground place-self-end">
          {tracker._count.games} game{tracker._count.games === 1 ? "" : "s"}
        </span>
      </ToggleGroupItem>
    ))
  );
}

const NoTrackersFound = () => {
  return (
    <Alert className="has-[>svg]:gap-x-2 px-3 py-2">
      <AlertCircleIcon />
      <AlertTitle>No trackers found!</AlertTitle>
      <AlertDescription>
        <span>There are currently no trackers for this leaderboard</span>
      </AlertDescription>
    </Alert>
  );
}
