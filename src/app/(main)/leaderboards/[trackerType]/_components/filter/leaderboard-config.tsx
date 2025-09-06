//* icons
import { Settings2Icon } from "lucide-react";

//* components
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const LeaderboardConfigurizer = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
        >
          <Settings2Icon />
          <span className="sr-only">configure leaderboard appearance</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 w-[min(calc(var(--radix-popper-available-width)-var(--spacing,0.25rem)*8),480px)]" align="end">
        <div className="space-y-1.5">
          <h4 className="font-medium text-lg leading-none">Config</h4>
          <p className="text-muted-foreground text-sm">
            Select which metrics and which trackers you want to see the statistics of
          </p>
        </div>

        <Tabs defaultValue="all_trackers">
          <TabsList className="w-full">
            <TabsTrigger value="all_trackers">All trackers</TabsTrigger>
            <TabsTrigger value="filter_specific">Filter specific</TabsTrigger>
          </TabsList>

          <TabsContent value="all_trackers">
            {/* for now now content */}
          </TabsContent>

          <TabsContent value="filter_specific">
            <span className="text-muted-foreground text-sm italic">comming soon...</span>
          </TabsContent>

        </Tabs>

      </PopoverContent>
    </Popover >
  );
}
