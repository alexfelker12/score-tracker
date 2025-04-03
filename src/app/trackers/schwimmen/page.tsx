import { cookies, headers } from "next/headers";
import { Suspense } from "react";

import { TrackerName } from "@prisma/client/edge";
import { getCookie } from 'cookies-next/server';

import { getAllArchivedTrackersForCreator, getAllTrackersAsParticipant, getAllTrackersByCreator } from "@/server/actions/tracker/actions";

import { auth } from "@/lib/auth";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";
import { TrackerGameForm } from "./_components/tracker-create-form";
import { TrackerListing } from "./_components/tracker-listing";
import { TrackerCardsLoading } from "./_components/trackers";

import { TrackerTabTrigger } from "./_components/tracker-tab-triggers";

export default async function Schwimmen() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Create tracker for `Schwimmen`</h2>

        {/* create tracker form */}
        {session && <TrackerGameForm session={session} minPlayers={2} maxPlayers={9} trackerName="SCHWIMMEN" />}
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-xl">Available trackers for `Schwimmen`</h2>

        {/* trackers associated with user */}
        <TrackerWrapper />
      </div>
    </main>
  );
}

const trackerName: TrackerName = "SCHWIMMEN"
async function TrackerWrapper() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const lastTab = await getCookie("schwimmen-last-tab", { cookies }) || "my-trackers"

  if (session) return (
    <Tabs defaultValue={lastTab} className="">
      <TabsList className="grid grid-cols-3 w-full">
        <TrackerTabTrigger value="my-trackers" cookieKey="schwimmen-last-tab">My Trackers</TrackerTabTrigger>
        <TrackerTabTrigger value="other" cookieKey="schwimmen-last-tab">Other</TrackerTabTrigger>
        <TrackerTabTrigger value="archived" cookieKey="schwimmen-last-tab">Archived</TrackerTabTrigger>
      </TabsList>
      <TabsContent value="my-trackers">
        <Suspense fallback={<Loading />}>
          {/* tracker created by user */}
          <TrackerListing
            trackerName={trackerName}
            userId={session.user.id}
            queryFunc={getAllTrackersByCreator}
            queryFuncName="getAllTrackersByCreator"
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="other">
        <Suspense fallback={<Loading />}>
          {/* tracker, where user is participating */}
          <TrackerListing
            trackerName={trackerName}
            userId={session.user.id}
            queryFunc={getAllTrackersAsParticipant}
            queryFuncName="getAllTrackersAsParticipant"
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="archived">
        <Suspense fallback={<Loading />}>
          {/* tracker archived by user */}
          <TrackerListing
            trackerName={trackerName}
            userId={session.user.id}
            queryFunc={getAllArchivedTrackersForCreator}
            queryFuncName="getAllArchivedTrackersForCreator"
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

const Loading = () => {
  return (
    <div>
      <Skeleton className="w-full h-9" />
      <TrackerCardsLoading />
    </div>
  );
}
