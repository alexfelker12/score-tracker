"use client"

import { useLeaderboardFilterStore } from "@/store/leaderboardFilterStore";

import { getMetricObj } from "./leaderboard-filter";

export const LeaderboardHead = () => {
  // metric
  const metric = useLeaderboardFilterStore((state) => state.metric)
  const { metricObj, MetricIcon } = getMetricObj(metric)

  return (
    <div className="top-16 z-30 sticky bg-background -mx-4 px-4 pb-2">
      <div className="flex justify-between items-center gap-2 px-[calc(var(--spacing)*3+1px)] pt-2 border-b-2">

        {/* # char indicating placement */}
        <span className="min-w-[1.5rem] text-center">#</span>


        {/* avatar width block */}
        <div className="w-9 h-6"></div>
        {/* name */}
        <span className="text-sm grow">
          {/* Name */}
        </span>


        {/* selected metric value */}
        <span className="h-6 text-sm">
          <MetricIcon className="inline-block size-4 align-middle" />
          <span className="align-middle"> {metricObj?.name}</span>
        </span>

      </div>
    </div>
  );
}