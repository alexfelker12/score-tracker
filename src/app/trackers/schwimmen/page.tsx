import { Divide, LoaderCircleIcon } from "lucide-react";
import { Suspense } from "react";
import { ParticipantsForm } from "./_components/participants-form";
import { TrackerCardLoading, TrackerListing } from "./_components/tracker-listing";

export default async function Schwimmen() {
  return (
    <main className="flex flex-col gap-6">
      <div>
        {/* heading + description */}
        <h1 className="text-2xl">Create tracker for `Schwimmen`</h1>
        {/* <p className="text-muted-foreground text-sm">Choose all players participating in this round</p> */}
      </div>

      {/* form - main content */}
      <ParticipantsForm minPlayers={2} maxPlayers={9} />

      <div className="space-y-4">
        <h2 className="font-medium text-lg">Available trackers for `Schwimmen`</h2>
        <Suspense fallback={
          <div className="gap-4 grid md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <TrackerCardLoading key={idx} />
            ))}
          </div>
        }>
          <TrackerListing trackerName="SCHWIMMEN" />
        </Suspense>
      </div>
    </main>
  );
}
