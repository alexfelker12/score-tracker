"use client"

import React from "react";

import { TrackerType } from "@prisma/client";

import { FindTrackersForLeaderboardReturn } from "@/server/actions/leaderboards/actions";

import { useLeaderboardTrackersQuery } from "@/hooks/use-leaderboard-trackers-query";
import { useTimeout } from "@/hooks/use-timeout";

import { cn } from "@/lib/utils";

//* stores
import { useLeaderboardFilterStore } from "@/store/leaderboardFilterStore";

//* icons
import { AwardIcon, BombIcon, ChevronDown, CrownIcon, FilterIcon, HandIcon, LucideIcon, PercentIcon, RotateCcwIcon, ShieldHalfIcon, UsersIcon } from "lucide-react";

//* components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledSeparator } from "@/components/ui/labeled-separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { LeaderboardFilterTrackers } from "./leaderboard-filter-trackers";
import { ManSwimmingIcon } from "@/components/icons/man-swimming";


type Metric = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  unit: string
  disabled: boolean
}
export const metrics: Metric[] = [
  {
    id: "total-wins",
    name: "Total wins",
    description: "Shows total wins",
    icon: CrownIcon,
    unit: "",
    disabled: false
  },
  {
    id: "winrate",
    name: "Winrate",
    description: "Shows winning percentage",
    icon: PercentIcon,
    unit: "%",
    disabled: false
  },
  {
    id: "total-games",
    name: "Appearances",
    description: "Shows total games played",
    icon: UsersIcon,
    unit: "%",
    disabled: false
  },
  {
    id: "total-nukes",
    name: "Total nukes",
    description: "Shows total nukes detonated",
    icon: BombIcon,
    unit: "",
    disabled: false
  },
  // {
  //   id: "total-lifes-lost",
  //   name: "Lifes lost",
  //   description: "Shows total lifes lost across all games",
  //   icon: HeartCrackIcon,
  //   unit: "",
  //   disabled: true
  // },
  {
    id: "total-unbreakable",
    name: "Unbreakable",
    description: "Shows the amount of times a player won while being the swimmer",
    icon: ShieldHalfIcon,
    unit: "",
    disabled: false
  },
  {
    id: "total-untouchable",
    name: "Untouchable",
    description: "Shows the amount of times a player won without losing a life",
    icon: HandIcon,
    unit: "",
    disabled: false
  },
  {
    id: "total-times-swimmer",
    name: "Total Swimmer",
    description: "Shows the amount of times a player was the swimmer",
    icon: ManSwimmingIcon as LucideIcon,
    unit: "",
    disabled: false
  },
  {
    id: "average-times-swimmer",
    name: "Ø Swimmer",
    description: "Shows the percentage of games the player was the swimmer",
    icon: ManSwimmingIcon as LucideIcon,
    unit: "%",
    disabled: false
  },
]
export const getMetricObj = (id: string) => {
  const metricObj = metrics.find((metric) => metric.id === id)
  const MetricIcon = metricObj?.icon || AwardIcon
  return { metricObj, MetricIcon }
}

//* calculates width and height of filter depending on available width and height of popover
// written here for organizational purposes
const popoverWidthHeight = "w-[min(calc(var(--radix-popper-available-width)-var(--spacing,0.25rem)*8),480px)] max-h-[calc(var(--radix-popper-available-height)-var(--spacing,0.25rem)*4)]"

type LeaderboardFilterProps = {
  trackerType: TrackerType
}
export const LeaderboardFilter = ({ trackerType }: LeaderboardFilterProps) => {
  // store values and functions
  const {
    metric, trackerIds,
    setMetric, setTrackerIds,
  } = useLeaderboardFilterStore()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [selectedMetric, setSelectedMetric] = React.useState<string>("total-wins")
  const [selectedTrackerMode, setSelectedTrackerMode] = React.useState<string>("all")
  const [selectedTrackerIds, setSelectedTrackerIds] = React.useState<string[]>([])

  const { data } = useLeaderboardTrackersQuery({ trackerType })
  const selectedTrackers = data && data.data &&
    data.data.filter((tracker) => selectedTrackerIds.includes(tracker.id))

  // badge count
  const filterCount = 0
    + (metric !== "total-wins" ? 1 : 0)
    + (trackerIds.length > 0 ? 1 : 0)
    ;

  // reset button disabled state
  const resetDisabled = selectedMetric === "total-wins" && selectedTrackerMode === "all";

  const { metricObj, MetricIcon } = getMetricObj(selectedMetric)

  const handleApplyFilter = () => {
    setMetric(selectedMetric)
    setTrackerIds(selectedTrackerMode === "specific" ? selectedTrackerIds : [])
    setIsOpen(false)
    if (selectedTrackerIds.length === 0) setSelectedTrackerMode("all")
  }

  const resetFilter = () => {
    if (resetDisabled) return;
    setSelectedMetric("total-wins")
    setSelectedTrackerMode("all")
    setSelectedTrackerIds([])
  }

  // reset selected filters on close/cancel
  useTimeout(() => {
    if (
      metric === selectedMetric
      && trackerIds === selectedTrackerIds
      && (
        (selectedTrackerIds.length > 0 && selectedTrackerMode === "specific")
        ||
        (selectedTrackerIds.length === 0 && selectedTrackerMode === "all")
      )
    ) return;
    setSelectedMetric(metric)
    setSelectedTrackerIds(trackerIds)
    setSelectedTrackerMode(trackerIds.length > 0 ? "specific" : "all")
  }, isOpen ? null : 150)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-1"
        >
          <FilterIcon className="size-4" />
          <span>Filter</span>
          {filterCount > 0 && <Badge variant="secondary" className="px-1 text-center leading-none">{filterCount}</Badge>}
          <ChevronDown className={cn("duration-150", isOpen && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(popoverWidthHeight, "grid grid-rows-[auto_1fr_auto] gap-y-4 overflow-y-auto")} align="end">

        {/* headline and filter reset */}
        <div className="flex justify-between items-center w-full">
          <div className="space-y-1.5">
            <h4 className="font-medium text-xl leading-none">Filter</h4>
            <p className="sr-only">Configure leaderboard appearance. Select which metrics and which trackers you want to see the statistics of</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilter}
            disabled={resetDisabled}
          >
            <RotateCcwIcon className="size-4" /> Reset
          </Button>
        </div>

        {/* tracker and metric filter */}
        <div className="space-y-4 overflow-y-auto grow">

          {/* trackers */}
          <div className="space-y-2">
            <LabeledSeparator>Trackers</LabeledSeparator>

            <RadioGroup
              className="gap-1"
              value={selectedTrackerMode}
              onValueChange={setSelectedTrackerMode}
            >
              {/* all */}
              <Label
                htmlFor="all-trackers"
                className={cn(
                  "flex gap-2 p-2 border-2 border-muted rounded-md font-normal text-sm",
                  selectedTrackerMode === "all" && "border-primary"
                )}
              >
                <RadioGroupItem
                  value="all"
                  id="all-trackers"
                />
                <span>All</span>
              </Label>

              {/* specific */}
              <div
                className="grid px-2 [&>*]:py-2 border-2 border-muted rounded-md"
              >
                <Label
                  htmlFor="specific-trackers"
                  className={cn(
                    "flex gap-2 font-normal text-sm",
                    selectedTrackerMode === "specific" && "border-b"
                  )}
                >
                  <RadioGroupItem
                    value="specific"
                    id="specific-trackers"
                  />
                  <span>Specific</span>
                </Label>

                {selectedTrackerMode === "specific" &&
                  <ToggleGroup
                    value={selectedTrackerIds}
                    onValueChange={setSelectedTrackerIds}
                    type="multiple"
                    className="gap-1 grid w-full"
                  >
                    <LeaderboardFilterTrackers
                      trackerType={trackerType}
                    />
                  </ToggleGroup>
                }
              </div>

            </RadioGroup>

            {/* selected trackers container */}
            {selectedTrackerMode === "specific" && <SelectedTrackers selectedTrackers={selectedTrackers} />}

          </div>

          {/* metric */}
          <div className="space-y-2">
            <LabeledSeparator>Metric</LabeledSeparator>

            {/* <ScrollArea className="h-44"> */}
            <RadioGroup
              className="gap-2 grid grid-cols-3 p-2 border rounded-md"
              value={selectedMetric}
              onValueChange={setSelectedMetric}
            >
              {metrics.map(({ id, name, icon: Icon, disabled }) => (
                <div key={id}>
                  <RadioGroupItem
                    value={id}
                    id={id}
                    className="sr-only"
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={id}
                    className={cn(
                      "flex flex-col gap-1 px-1 py-2 border-2 border-muted rounded-md text-center text-xs",
                      selectedMetric === id && "border-primary bg-primary/5",
                      disabled && "pointer-events-none opacity-50"
                    )}
                    aria-disabled={disabled}
                  >
                    <Icon className="size-4" />
                    {name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {/* </ScrollArea> */}

            <p className="-mt-1 text-sm">
              <MetricIcon className="inline-block size-4 align-middle" />
              <span className="align-middle"> {metricObj?.name}: </span>
              <span className="inline text-muted-foreground align-middle">{metricObj?.description}</span>
            </p>
          </div>
        </div>

        {/* cancel/confirm actions */}
        <div className="flex justify-end gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApplyFilter}
          >
            Apply filter
          </Button>
        </div>

      </PopoverContent >
    </Popover >
  );
}

const SelectedTrackers = ({
  selectedTrackers
}: {
  selectedTrackers: FindTrackersForLeaderboardReturn | undefined
}) => {
  if (!selectedTrackers || selectedTrackers.length === 0) return;

  return (
    <p className="[&>*]:last:hidden text-sm">
      Selected: {selectedTrackers.map((selectedTracker) => (
        <React.Fragment key={selectedTracker.id}>
          <span className="text-muted-foreground">{selectedTracker.displayName}</span>
          <span className="text-muted-foreground">, </span>
        </React.Fragment>
      ))}
    </p>
  );
}

