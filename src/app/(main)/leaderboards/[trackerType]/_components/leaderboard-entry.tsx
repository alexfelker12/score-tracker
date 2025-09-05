import { LeaderboardEntryType } from "@/server/actions/leaderboards/functions";

type LeaderboardEntryProps = {
  entry: LeaderboardEntryType
}
export const LeaderboardEntry = ({ entry: { user, placing, metricValue } }: LeaderboardEntryProps) => {
  return (
    <>
      {/* <Avatar className="size-9">
        <AvatarImage src={trackerPlayer.player && trackerPlayer.player.image || undefined}></AvatarImage>
        <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
      </Avatar> */}
      <div className="">
        <p>Name: {user.displayUsername || user.name}</p>
        <p>Placing: {placing}</p>
        <p>Winrate: {metricValue}</p>
      </div>
    </>
  );
}
