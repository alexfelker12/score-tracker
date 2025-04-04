import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";
import { TrackerDetailsWrap } from "./_components/tracker-details-wrap";
import { limitCharacters } from "@/lib/utils";


export default async function TrackerSessionPage({
  params,
}: {
  params: Promise<{ trackerId: string }>
}) {
  const { trackerId } = await params

  const trackerIdSplits = trackerId.split("-", 2);
  const actualId = trackerIdSplits[0]
  const displayName = decodeURIComponent(trackerIdSplits[1])
  const navTrailName = limitCharacters(displayName, 11) || "Tracker"

  const dynNavTrail: BreadcrumbType = {
    name: navTrailName
  }

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs lastTrail={dynNavTrail} />
      <TrackerDetailsWrap trackerId={actualId} />
    </main>
  );
}
