import { getTracker } from "@/server/actions/trackerActions";
import Link from "next/link";
import { Tracker } from "./_components/tracker";
import { participantsSchemaBase } from "@/schema/participants";

export default async function TrackerSessionPage({
  params,
}: {
  params: Promise<{ trackerId: string }>
}) {
  const { trackerId } = await params
  const { data, error } = await getTracker({
    where: {
      id: trackerId
    }
  })

  //* check for data validity or errors
  if (error) return <ErrorMessage error={error} />;
  if (!data || !data.playerData) return <InvalidTrackerMessage />;

  //* validate json data on participants schema
  const { success, data: parsedData } = participantsSchemaBase.shape.players.safeParse(data.playerData);
  if (!success) return <InvalidTrackerMessage />;

  return (
    <main>
      <Tracker trackerData={parsedData} trackerId={trackerId} />
    </main>
  );
}

const ErrorMessage = ({ error }: { error: unknown }) => (
  <main>
    <p>
      There was an error loading this tracker: {JSON.stringify(error)}
    </p>
  </main>
);

const InvalidTrackerMessage = () => (
  <main>
    <p>
      This tracker is invalid. Create a new one{" "}
      <Link href="/trackers/schwimmen" className="text-primary">here</Link>.
    </p>
  </main>
);