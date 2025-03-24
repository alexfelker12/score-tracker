import { Breadcrumbs } from "@/components/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Suspense } from "react";
import { ParticipantsForm } from "./_components/participants-form";
import { TrackerCardsLoading } from "./_components/tracker-list";
import { TrackerListingPast } from "./_components/tracker-listing-past";
import { TrackerListingToday } from "./_components/tracker-listing-today";

export const dynamic = 'force-dynamic'

export default async function Schwimmen() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div className="space-y-2">
        {/* heading + description */}
        <h1 className="font-bold text-2xl">Create tracker for `Schwimmen`</h1>
        {/* <p className="text-muted-foreground text-sm">Choose all players participating in this round</p> */}

        {/* create tracker form */}
        <ParticipantsForm minPlayers={2} maxPlayers={9} trackerName="SCHWIMMEN" />
      </div>

      <div>
        <h2 className="mt-2 font-bold text-xl">Available trackers for `Schwimmen`</h2>

        {/* see available trackers */}
        <Accordion type="multiple" defaultValue={["today"]}>

          {/* trackers created today */}
          <AccordionItem value="today">
            <AccordionTrigger className="items-center"><span className="font-semibold text-lg">Created today</span></AccordionTrigger>

            {/* content */}
            <AccordionContent className="gap-4 grid md:grid-cols-2">
              <Suspense fallback={<TrackerCardsLoading />}>
                <TrackerListingToday trackerName="SCHWIMMEN" />
              </Suspense>
            </AccordionContent>

          </AccordionItem>

          {/* trackers created past time */}
          <AccordionItem value="past">
            <AccordionTrigger className="items-center"><span className="font-semibold text-lg">Created in the past</span></AccordionTrigger>

            {/* content */}
            <AccordionContent className="gap-4 grid md:grid-cols-2">
              <Suspense fallback={<TrackerCardsLoading />}>
                <TrackerListingPast trackerName="SCHWIMMEN" />
              </Suspense>
            </AccordionContent>

          </AccordionItem>

        </Accordion>
      </div>
    </main>
  );
}
