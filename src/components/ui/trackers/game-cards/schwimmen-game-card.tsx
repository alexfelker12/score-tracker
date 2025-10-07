"use client"

//* next/react
import Link from "next/link";

//* server
import { FindTrackerByIdReturnGame } from "@/server/actions/tracker/actions";

//* lib
import { cn, timeElapsed } from "@/lib/utils";

//* icons
import { CrownIcon, DicesIcon, InfoIcon, UserIcon } from "lucide-react";

//* components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { SchwimmenGame } from "prisma/json_types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";


export type SchwimmenGameCardProps = {
  game: FindTrackerByIdReturnGame
}
export const SchwimmenGameCard = ({ game }: SchwimmenGameCardProps) => {
  const timeDate = timeElapsed(game.createdAt)
  const winner = game.participants.find((p) => (game.gameData as SchwimmenGame).winner === p.id)
  const swimmer = game.participants.find((p) => (game.gameData as SchwimmenGame).swimming === p.id)

  return (
    <Item size="xs" variant="outline">
      <ItemContent className="gap-0.5">
        <ItemTitle>{timeDate} - {game.participants.length} players</ItemTitle>
        <ItemDescription>
          <Link href={`/trackers/schwimmen/${encodeURIComponent(game.tracker.id) + "-" + game.tracker.displayName}/${game.id}`}>
            {game.id}
          </Link>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full"><InfoIcon /></Button>
          </DialogTrigger>
          <DialogContent>
            {/* game header & description */}
            <DialogHeader>
              <DialogTitle>Game summary</DialogTitle>
              <DialogDescription>{timeDate} - {game.participants.length} players - {game.status}</DialogDescription>
            </DialogHeader>

            {/* main content - participants, swimmer, winner */}
            <Accordion
              className="w-full"
              type="multiple"
              defaultValue={game.status !== "ACTIVE" ? ["winner", "swimmer"] : ["participants"]}
            >
              {game.status !== "ACTIVE" && <>
                <AccordionItem value="winner">
                  <AccordionTrigger className="py-2">Winner</AccordionTrigger>
                  <AccordionContent>
                    {winner
                      ? <GameParticipantCard participant={winner} gameState="winner" />
                      : <span className="flex justify-self-center p-2 w-full">No winner in this game</span>
                    }
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="swimmer">
                  <AccordionTrigger className="py-2">Swimmer</AccordionTrigger>
                  <AccordionContent>
                    {swimmer
                      ? <GameParticipantCard participant={swimmer} gameState="swimmer" />
                      : <span className="flex justify-self-center p-2 w-full">No swimmer in this game</span>
                    }
                  </AccordionContent>
                </AccordionItem>
              </>}
              <AccordionItem value="participants">
                <AccordionTrigger className="py-2">Participants</AccordionTrigger>
                <AccordionContent className="space-y-1">
                  {game.participants.map((participant) =>
                    <GameParticipantCard
                      key={participant.id}
                      participant={participant}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* game actions */}
            <DialogFooter className="flex-row justify-between sm:justify-between">
              <Button className="flex-1/2" asChild
                variant="ghost"
              >
                <Link href={`/trackers/schwimmen/${encodeURIComponent(game.tracker.id) + "-" + game.tracker.displayName}/${game.id}`}>
                  Go to game
                </Link>
              </Button>
              <Button className="flex-1/2"
                variant="outline"
              >
                <DicesIcon /> Replay
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ItemActions>
    </Item>

  );
}

type GameParticipantCardProps = {
  participant: FindTrackerByIdReturnGame["participants"][0]
  gameState?: "winner" | "swimmer" | "none"
}
const GameParticipantCard = ({ participant, gameState = "none" }: GameParticipantCardProps) => {
  const user = participant.user

  let stateClassNames = ""
  switch (gameState) {
    case "winner":
      stateClassNames = "border-yellow-300 border-2"
      break
    case "swimmer":
      stateClassNames = "border-swimming border-2"
      break
    case "none":
  }

  return (
    <div className={cn("flex justify-between items-center gap-x-4 p-2 border rounded-md", stateClassNames)}>
      <div className="flex items-center gap-x-2">
        <Avatar className="size-9">
          <AvatarImage src={user && user.image || undefined}></AvatarImage>
          <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
        </Avatar>
        <div className="font-medium text-base leading-none">
          <span>
            {user
              ? user.displayUsername || user.name
              : participant.displayName
            }
          </span>
        </div>
      </div>
      {gameState === "winner" && <CrownIcon className="text-yellow-300 fill-yellow-300" />}
    </div>
  );
}
