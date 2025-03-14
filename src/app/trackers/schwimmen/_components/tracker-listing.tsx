import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { timeElapsed } from "@/lib/utils";
import { getAllTrackersByArg } from "@/server/actions/trackerActions";
import { Tracker, TrackerName } from "@prisma/client/edge";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export type TrackerListingType = {
  trackerName: TrackerName
}

export const TrackerListing = async ({ trackerName }: TrackerListingType) => {
  const trackers = await getAllTrackersByArg({
    where: {
      name: trackerName
    }
  })

  // await delay(300)

  if (trackers && trackers.data) return (
    <div className="gap-4 grid md:grid-cols-2">
      {trackers.data.map((tracker) => (
        <TrackerCard key={tracker.id} {...tracker} />
      ))}
    </div>
  );
}

export type TrackerCardType = Tracker
export const TrackerCard = ({ id, name, createdAt }: TrackerCardType) => {
  return (
    <Link href={`/trackers/schwimmen/${id}`} className="group">
      <Card className="group-hover:bg-accent justify-between gap-4 py-4 w-full h-full transition-all">
        <CardHeader className="px-4">

          <CardTitle className="text-lg leading-none">{name}</CardTitle>
          <CardDescription className="leading-none">{timeElapsed(createdAt)}</CardDescription>

        </CardHeader>
        <CardContent className="flex justify-end">

          {/* extra link to tracker */}
          <div className="flex items-center">
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </div>

        </CardContent>
      </Card>
    </Link>
  )
}

export const TrackerCardLoading = () => {
  return (
    <Skeleton className="rounded-xl h-28"></Skeleton>
  )
}