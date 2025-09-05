import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";


import { auth } from "@/lib/auth";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PATH_TO_TRACKERPROPS } from "@/lib/constants";
import { getAllTrackersAsParticipant } from "@/server/actions/tracker/actions";
import { getOtherUsers } from "@/server/actions/user/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ListFilterIcon } from "lucide-react";
import { getLeaderboard } from "@/server/actions/leaderboards/functions";




/**
 * TODO: this was just copy pasted with slight modification -> declare ui for showing leaderboard + think about showing metrics by single (or multiple) tracker(s) -> multi select?
 * ? -> maybe ui combining all and by single tracker view?
 * * IDEA: Filter button in top right opening Dialog with multiple filters (one is all trackers or specific), applying filters after press on "confirm" or "apply" button, cancel with closing or pressing "cancel" 
 *
 * Trackers      : all - specific (multiple)
 * 
 * Value type    : absolute (total) - relative (%)
 * Ranking order : asc - desc
 */





type PathToPropsCast = keyof typeof PATH_TO_TRACKERPROPS
export default async function TrackersPage({
  params,
}: {
  params: Promise<{ trackerType: string }>
}) {
  // get tracker type from dynamic route params
  const { trackerType } = await params

  if (!Object.keys(PATH_TO_TRACKERPROPS).includes(trackerType)) notFound()

  const trackerPathType = PATH_TO_TRACKERPROPS[trackerType as PathToPropsCast].trackerType
  const queryKey = ["trackers", trackerPathType, "trackers"]

  const leaderboard = await getLeaderboard();
  console.log(leaderboard);

  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs />

      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <h2 className="font-bold text-2xl">{PATH_TO_TRACKERPROPS[trackerType as PathToPropsCast].title}</h2>

          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <ListFilterIcon /> Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(calc(var(--radix-popper-available-width)-var(--spacing,0.25rem)*8),480px)]" align="end">
              <span className="text-muted-foreground text-sm italic">filters cooming soon...</span>
            </PopoverContent>
          </Popover>

        </div>
        <div>

          <Tabs defaultValue="all_trackers">
            <TabsList className="w-full">
              <TabsTrigger value="all_trackers">All</TabsTrigger>
              <TabsTrigger value="chosen_trackers">By tracker</TabsTrigger>
            </TabsList>
            <TabsContent value="all_trackers">
              All Trackers
            </TabsContent>
            <TabsContent value="chosen_trackers">
              Chosen Trackers
            </TabsContent>
          </Tabs>

        </div>


        {/* select metric 
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        */}
      </div>

      <div className="flex flex-col gap-y-4">
        {leaderboard.map(({user, placing, metricValue}) => {
          return (
            <div key={user.id}>
              <p>Name: {user.displayUsername || user.name}</p>
              <p>Placing: {placing}</p>
              <p>MetricValue: {metricValue}</p>
            </div>
          )
        })}
      </div>

    </main>
  );
}
