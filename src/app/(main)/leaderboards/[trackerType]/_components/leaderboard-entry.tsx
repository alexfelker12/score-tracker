import { LeaderboardEntryType } from "@/server/actions/leaderboards/functions";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";


type LeaderboardEntryProps = {
  entry: LeaderboardEntryType
}

const getPlacementStyles = (placing: number) => {
  // created variable for tailwind intellisense
  switch (placing) {
    case 1:
      const topOneClassNames = "border-yellow-300 bg-yellow-300/10"
      return topOneClassNames;
    case 2:
      const topTwoClassNames = "border-slate-300 bg-slate-300/10"
      return topTwoClassNames;
    case 3:
      const topThreeClassNames = "border-yellow-700 bg-yellow-700/10"
      return topThreeClassNames;
    default:
      return ""
  }
}

export const LeaderboardEntry = ({ entry: { user, placing, metricValue } }: LeaderboardEntryProps) => {
  const isTopOne = placing === 1;
  const isTopTwo = placing === 2;
  const isTopThree = placing === 3;
  const hasTopThreePlacement = isTopOne || isTopTwo || isTopThree
  const username = user.displayUsername || user.name

  const placementStyles = getPlacementStyles(placing)

  return (
    <Card
      className={cn(
        "flex flex-row items-center gap-2 p-3 border-2 rounded-md transition-all",
        placementStyles
      )}
    >
      {/* Rang */}
      <div
        className={cn(
          "min-w-[1.5rem] font-bold text-center",
          hasTopThreePlacement ? "text-lg" : "text-sm text-muted-foreground"
        )}
      >
        {placing}
      </div>

      {/* avatar */}
      <Avatar className="size-9">
        <AvatarImage src={user.image ?? undefined} alt={username} />
        <AvatarFallback className="text-sm">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* username */}
      <span
        className={cn(
          "flex-1",
          hasTopThreePlacement ? "font-semibold" : ""
        )}>
        {username}
      </span>

      {/* metricValue */}
      <Badge
        variant={hasTopThreePlacement ? "secondary" : "outline"}
        className={cn(
          "",
          hasTopThreePlacement && "font-bold"
        )}
      >
        {metricValue}
      </Badge>
    </Card>
  );
};
