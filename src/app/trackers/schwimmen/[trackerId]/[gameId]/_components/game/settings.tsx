"use client"

import { ActionStatus, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

import { SettingsIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

/**
 ** head buttons:
 ** section 1 (left):
 * - options:
 *   - hide dead player (toggle)
 *   - card sizer (slider)
 *   - reset game (button)
 *   - cancel game (red button)
*/

// TODO Prio 4: settings

export type SettingsParams = {

}
export const Settings = (params: SettingsParams) => {
  const { } = params

  //* hooks here
  const isAction = useSchwimmenGameStore((state) => state.isAction)

  // const schwimmenGame = useSchwimmenGameStore()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          disabled={!isAction(ActionStatus.ISIDLE)}
        >
          <SettingsIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Adjust appearance and handle game progress
          </DialogDescription>
        </DialogHeader>

        {/* text size slider */}
        {/* <div className="flex flex-1 gap-2">
          {isHydrated ?
            <>
              <span className="text-sm leading-none">XS</span>
              <Slider
                min={0}
                max={4}
                value={[trackerSession.session.cardSize]}
                defaultValue={[trackerSession.session.cardSize]}
                onValueChange={(value) => trackerSession.setCardSize(value[0])}
                step={1}
              />
              <span className="text-sm leading-none">XL</span>
            </>
            :
            <Skeleton className="w-full h-3.5" />
          }
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
