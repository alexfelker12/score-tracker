import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";


import { auth } from "@/lib/auth";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TrackerForm } from "./_components/tracker-create-form";
import { TrackerListing } from "./_components/tracker-listing";

import { PATH_TO_TRACKERPROPS } from "@/lib/constants";
import { getAllTrackersAsParticipant } from "@/server/actions/tracker/actions";
import { getOtherUsers } from "@/server/actions/user/actions";
import { CommandWrapperLoading } from "./_components/tracker-loading";

type PathToPropsCast = keyof typeof PATH_TO_TRACKERPROPS
export default async function TrackersPage({
  params,
}: {
  params: Promise<{ trackerType: string }>
}) {
  // get tracker type from dynamic route params
  const { trackerType } = await params

  // export default async function Schwimmen() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect("/sign-in")

  if (!Object.keys(PATH_TO_TRACKERPROPS).includes(trackerType)) notFound()

  const trackerPathType = PATH_TO_TRACKERPROPS[trackerType as PathToPropsCast].trackerType
  const queryKey = ["trackers", trackerPathType, session.user.id, "trackers"]

  // const qc = getQueryClient()
  // qc.prefetchQuery({
  //   queryKey,
  //   queryFn: () => getAllTrackersAsParticipant(trackerPathType, session.user.id)
  // })

  const playerDialogDataPromise = getOtherUsers(session.user.id)
  const participatingTrackerDataPromise = getAllTrackersAsParticipant(trackerPathType, session.user.id)

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">{PATH_TO_TRACKERPROPS[trackerType as PathToPropsCast].title}</h2>

          {/* <Suspense fallback={<Skeleton className="w-32 h-9" />}> */}
            <TrackerForm session={session} trackerType={trackerPathType} dataPromise={playerDialogDataPromise} />
          {/* </Suspense> */}
        </div>

        {/* create tracker form */}
        {/* <TrackerForm session={session} minPlayers={2} maxPlayers={9} trackerType={trackerPathType} /> */}

        {/* trackers associated with user */}
        <Tabs defaultValue="trackers">
          {/* tabs */}
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="trackers">Trackers</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          {/* content */}
          <TabsContent value="trackers">
            <Suspense fallback={<CommandWrapperLoading />}>

              {/* <HydrationBoundary state={dehydrate(qc)}> */}
              {/* tracker, where user is participating */}
              <TrackerListing
                session={session}
                trackerType={trackerPathType}
                dataPromise={participatingTrackerDataPromise}
                queryKey={queryKey}
              />
              {/* </HydrationBoundary> */}

            </Suspense>
          </TabsContent>
          <TabsContent value="archived">
            <Card className="p-0 rounded-md">
              <CardContent className="place-items-center grid p-2">
                <span className="text-muted-foreground text-sm italic">Cooming soon...</span>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

    </main>
  );
}
