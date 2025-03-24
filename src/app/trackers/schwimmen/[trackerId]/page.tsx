import Link from "next/link";

import { getTrackerById } from "@/server/actions/trackerActions";

import { participantsSchemaBase } from "@/schema/participants";

import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";
import { Tracker } from "./_components/tracker";


export default async function TrackerSessionPage({
  params,
}: {
  params: Promise<{ trackerId: string }>
}) {
  const { trackerId } = await params

  const dynNavTrail: BreadcrumbType = {
    name: `${trackerId.slice(0, 5)}...`
  }

  const { data, error } = await getTrackerById(trackerId)

  //* check for data validity or errors
  if (error) return <ErrorMessage error={error} />;
  if (!data || !data.playerData) return <InvalidTrackerMessage />;

  //* validate json data on participants schema
  const { success, data: parsedData } = participantsSchemaBase.shape.players.safeParse(data.playerData);
  if (!success) return <InvalidTrackerMessage />;

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs lastTrail={dynNavTrail} />
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
)

const InvalidTrackerMessage = () => (
  <main>
    <p>
      This tracker is invalid. Create a new one{" "}
      <Link href="/trackers/schwimmen" className="text-primary">here</Link>.
    </p>
  </main>
)
