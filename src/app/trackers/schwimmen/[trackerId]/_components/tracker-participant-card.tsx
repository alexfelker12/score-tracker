import { Card } from "@/components/ui/card";
import { ManSwimmingIcon } from "@/components/ui/icons/man-swimming";
import { SkullIcon } from "@/components/ui/icons/skull";
import { Skeleton } from "@/components/ui/skeleton";
import { SCHWIMMEN_TEXT_SIZE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Player } from "@/store/schwimmenSessionStore";
import { HeartIcon } from "lucide-react";


export type ParticipantCardType = Player & {
  size: number
  playerSwimming?: number
}

export const ParticipantCard = ({ id, lifes, name, size, playerSwimming }: ParticipantCardType) => {
  return (
    <Card
      key={id}
      className={cn("p-2",
        lifes <= 0 && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex justify-between items-center gap-4">
        <span
          className={cn("text-sm",
            SCHWIMMEN_TEXT_SIZE_MAP[size]
          )}
        >{name}</span>

        <div className="flex gap-1 w-fit">
          {playerSwimming === id && lifes > 0 ?
            <ManSwimmingIcon className={SCHWIMMEN_TEXT_SIZE_MAP[size]} />
            :
            lifes === 0 ?
              <SkullIcon className={SCHWIMMEN_TEXT_SIZE_MAP[size]} />
              :
              Array.from({ length: lifes }).map((_, idx) => (
                <HeartIcon key={idx}
                  className={cn("size-6 stroke-red-500 fill-red-500",
                    SCHWIMMEN_TEXT_SIZE_MAP[size]
                  )}
                />
              ))
          }
        </div>
      </div>
    </Card>
  );
}

export type ParticipantCardLoadingType = {
  size: number
}

ParticipantCard.loading = ({ size }: ParticipantCardLoadingType) => {
  return (
    <Skeleton className="p-2 border border-transparent rounded-xl">
      <div className={cn("invisible opacity-0", SCHWIMMEN_TEXT_SIZE_MAP[size])} aria-hidden="true">sizer text</div>
    </Skeleton>
  )
}
