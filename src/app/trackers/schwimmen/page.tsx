import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";
import { ParticipantsForm } from "./_components/participants-form";
import { TrackerListing } from "./_components/tracker-listing";

const navTrail: BreadcrumbType[] = [
  {
    name: "trackers",
    href: "/trackers"
  },
  {
    name: "schwimmen",
  }
]

export default async function Schwimmen() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs navTrail={navTrail} />

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
        <TrackerListing trackerName="SCHWIMMEN" />
      </div>
    </main>
  );
}
