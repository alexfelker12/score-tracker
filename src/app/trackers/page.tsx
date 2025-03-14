import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";
import { TRACKERS } from "@/lib/constants";
import { TrackerLink } from "./_components/tracker-link";

const navTrail: BreadcrumbType[] = [
  {
    name: "trackers",
  }
]

export default function Trackers() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs navTrail={navTrail}  />
      <div>
        {/* heading + description */}
        <h1 className="text-2xl">Trackers</h1>
        <p className="text-muted-foreground text-sm">Explore trackers for different games</p>
      </div>

      {/* games list */}
      <div className="gap-4 grid md:grid-cols-2">
        {TRACKERS.map((tracker) => (
          <TrackerLink key={tracker.href} {...tracker} />
        ))}
      </div>
    </main>
  );
}
