import { Breadcrumbs } from "@/components/breadcrumbs";
import { TrackerLink } from "@/components/ui/trackers/tracker-link";
import { TRACKERS } from "@/lib/constants";

export default function Leaderboards() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div>
        {/* heading + description */}
        <h1 className="font-bold text-2xl">Leaderboards</h1>
        <p className="text-muted-foreground text-sm">See leaderboards for different games</p>
      </div>

      {/* games list */}
      <div className="gap-4 grid md:grid-cols-2">
        {TRACKERS.map((tracker) => (
          <TrackerLink key={tracker.href} basePath="/leaderboards" {...tracker} />
        ))}
      </div>
    </main>
  );
}
