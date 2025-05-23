import { Breadcrumbs } from "@/components/breadcrumbs";
import { TRACKERS } from "@/lib/constants";
import { TrackerLink } from "@/components/trackers/tracker-link";

export default function Trackers() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />
      
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
