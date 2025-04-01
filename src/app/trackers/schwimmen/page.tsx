import { headers } from "next/headers";
import { Suspense } from "react";

import { TrackerName } from "@prisma/client/edge";

import { getAllArchivedTrackersForCreator, getAllTrackersByCreator, getAllTrackersAsParticipant } from "@/server/actions/tracker/actions";

import { auth } from "@/lib/auth";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TrackerGameForm } from "./_components/tracker-create-form";
import { TrackerListing } from "./_components/tracker-listing";
import { TrackerCardsLoading } from "./_components/trackers";


export default async function Schwimmen() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Create tracker for `Schwimmen`</h2>

        {/* create tracker form */}
        <TrackerGameForm minPlayers={2} maxPlayers={9} trackerName="SCHWIMMEN" />
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

  if (session) return (
    <Tabs defaultValue="my-trackers" className="">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="my-trackers">My Trackers</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="my-trackers">
        <Suspense fallback={<TrackerCardsLoading />}>
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
        <Suspense fallback={<TrackerCardsLoading />}>
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
        <Suspense fallback={<TrackerCardsLoading />}>
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
