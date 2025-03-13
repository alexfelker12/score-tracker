"use client"

import { GetTrackerReturnType } from "@/server/actions/trackerActions";
import Link from "next/link";
import { participantsSchemaBase } from "../../_components/participants-form";

export type TrackerType = {
  trackerData: GetTrackerReturnType | undefined
  error?: unknown;
}

export const Tracker = ({ trackerData, error }: TrackerType) => {
  //* hooks here

  //* check for data validity or errors
  if (error) return <ErrorMessage error={error} />;
  if (!trackerData) return <InvalidTrackerMessage />;

  //* valided json data on participants schema
  const { success, data } = participantsSchemaBase.shape.players.safeParse(trackerData.playerData);
  if (!success) return <InvalidTrackerMessage />;

  return (
    <>
      {data.map((player, idx) => (
        <p key={idx}>{player.name}</p>
      ))}
    </>
  );
}

const ErrorMessage = ({ error }: { error: unknown }) => (
  <p>
    There was an error loading this tracker: {JSON.stringify(error)}
  </p>
);

const InvalidTrackerMessage = () => (
  <p>
    This tracker is invalid. Create a new one{" "}
    <Link href="/trackers/schwimmen" className="text-primary">here</Link>.
  </p>
);