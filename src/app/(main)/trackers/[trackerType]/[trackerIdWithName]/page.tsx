
import { getTrackerById } from "@/server/actions/tracker/actions";

import { limitCharacters } from "@/lib/utils";

import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";

import { auth } from "@/lib/auth";
import { getOtherUsers } from "@/server/actions/user/actions";
import { Loader2Icon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TrackerDetails } from "./_components/tracker-details";


export default async function TrackerPage({
  params,
}: {
  params: Promise<{ trackerIdWithName: string }>
}) {
  const { trackerIdWithName } = await params

  const trackerIdSplits = trackerIdWithName.split("-", 2);
  const trackerId = trackerIdSplits[0]
  const displayName = decodeURIComponent(trackerIdSplits[1])
  const navTrailName = limitCharacters(displayName, 11) || "Tracker"

  const dynNavTrail: BreadcrumbType = {
    name: navTrailName
  }

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect("/sign-in");

  const trackerDataPromise = getTrackerById(trackerId)
  const playerDialogDataPromise = getOtherUsers(session.user.id)
  const queryKey = ["trackers", trackerId]
  
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs lastTrail={dynNavTrail} />
      {/* <TrackerDetailsWrap trackerId={trackerId} /> */}

      <Suspense fallback={<div className="place-items-center grid w-full h-full">
        <Loader2Icon className="text-primary animate-spin size-8" />
      </div>}>
        <TrackerDetails
          session={session}
          queryKey={queryKey}
          trackerId={trackerId}
          dataPromise={trackerDataPromise}
          playerDialogDataPromise={playerDialogDataPromise}
        />
      </Suspense>
      
    </main>
  );
}


// export type TrackerDetailsWrapProps = {
//   trackerId: string
// }

// const TrackerDetailsWrap = async (trackerParams: TrackerDetailsWrapProps) => {
//   const { trackerId } = trackerParams
//   const qc = getQueryClient()
//   await qc.prefetchQuery({
//     queryKey: ["trackers", trackerId],
//     queryFn: () => getTrackerById(trackerId)
//   })

//   return (
//     <HydrationBoundary
//       state={dehydrate(qc)}
//     >
      
//     </HydrationBoundary>
//   );
// }
