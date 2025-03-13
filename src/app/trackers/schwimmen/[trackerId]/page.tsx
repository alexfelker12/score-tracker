import { getTracker } from "@/server/actions/trackerActions";
import { Tracker } from "./_components/tracker";

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

  return (
    <main>
      <Tracker trackerData={data} error={error} />
    </main>
  );
}
