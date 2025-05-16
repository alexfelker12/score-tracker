"use client"

import React, { SetStateAction, use } from "react"

import { z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { participantsSchema } from "@/schema/participants"
import { getOtherUsers } from "@/server/actions/user/actions"
import { useQuery } from "@tanstack/react-query"
import { Loader2Icon, PlusIcon, SaveIcon, UserIcon, XIcon } from "lucide-react"
import { User } from "prisma/zod/modelSchema/UserSchema"

export type TrackerParticipant = z.infer<typeof participantsSchema.shape.players>[0]

export type AddPlayerDialogType = {
  userId: string
  saveFunc: (participant: TrackerParticipant) => void
  userPlayers: string[]
  guestPlayers: string[]
  dataPromise: ReturnType<typeof getOtherUsers>
  open?: boolean
  setOpen?: React.Dispatch<SetStateAction<boolean>> | ((open: boolean) => void)
}

export const AddPlayerDialog = ({
  userId, saveFunc, userPlayers, guestPlayers, dataPromise,
  open, setOpen
}: AddPlayerDialogType) => {
  const [participant, setParticipant] = React.useState<TrackerParticipant>()
  const [guest, setGuest] = React.useState<string>("")
  const guestInputRef = React.useRef<HTMLInputElement>(null)

  //* GET users by username
  const { data, isFetching } = useQuery({
    initialData: use(dataPromise),
    queryKey: ["users", userId],
    queryFn: () => getOtherUsers(userId),
    refetchOnMount: false, refetchOnReconnect: false,
  })

  const save = () => {
    if (!participant || isExistingGuest) return;

    //* execute passed function
    saveFunc(participant)

    //* unset participant afterwards
    setParticipant(undefined)
    setGuest("")
  }

  const guestInputDisabled = participant && !participant.guest
  const isExistingGuest = participant && participant.guest && guestPlayers.includes(guest)
  const controlled = typeof open !== "undefined" && typeof setOpen !== "undefined"

  return (
    <Dialog
      {...(controlled ? {
        open: open,
        onOpenChange: setOpen
      } : {})}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="justify-start !pl-2 w-auto h-8 text-muted-foreground"
        >
          <PlusIcon className="size-5" /> Add player
        </Button>
      </DialogTrigger>
      <DialogContent hideOverlay={controlled}>
        <DialogHeader>
          <DialogTitle>Add a player</DialogTitle>
          <DialogDescription>
            Either add an existing user to your tracker or create a guest player
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">

          {/* existing user */}
          <Command
            className="flex-1 shadow-md border rounded-lg md:min-w-[450px] transition-shadow">
            <CommandInput
              placeholder="Search for a user..."
            //* if input is disabled items are not accessable anymore...
            // disabled={participant && !participant.guest}
            />
            <CommandList className="[&>div]:space-y-1 p-1">
              {isFetching ?
                <CommandItem className="justify-center py-3.5">
                  <Loader2Icon className="text-primary animate-spin size-5" />
                </CommandItem>
                :
                data && data.data && data.data.map((user) => {
                  const isAlreadyParticipating = userPlayers.includes(user.id)
                  return (
                    <CommandItem key={user.id}
                      value={user.displayUsername || user.name}
                      disabled={isAlreadyParticipating}
                      onSelect={() => {
                        if (isAlreadyParticipating) return;
                        //* check if participant is selected, if same toggle else select new
                        setParticipant(!participant || participant.guest || !participant.guest && participant.user.id !== user.id
                          ? {
                            guest: false,
                            user
                          }
                          //* if toggled, check if guest player name was inputed else set undefined
                          : !!guest
                            ? {
                              guest: true,
                              name: guest
                            }
                            : undefined
                        )
                      }}
                      className={cn(
                        "",
                        guestInputDisabled && participant.user.id === user.id
                        && "border-primary ring-ring/50 ring-[1.5px]"
                      )}
                    >
                      <ParticipantCardDetails
                        participant={participant}
                        user={user}
                      />
                    </CommandItem>
                  )
                })
              }

              <CommandEmpty className="flex justify-center md:col-span-2 py-3.5 text-muted-foreground text-sm">
                No results found
              </CommandEmpty>
            </CommandList>
          </Command>

          {/* separator */}
          <div className='relative'>
            <Separator />
            <span className='top-1/2 left-1/2 absolute bg-background px-2 text-muted-foreground text-sm leading-none -translate-x-1/2 -translate-y-1/2'>or</span>
          </div>

          {/* guest player */}
          <div>
            <div className="relative shrink-0">
              <Input
                placeholder="Guest name"
                disabled={guestInputDisabled}
                value={guest}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  //* only change guest name if no participant was selected
                  if (guestInputDisabled) return;
                  setGuest(e.target.value)
                  setParticipant(!!e.target.value
                    ? {
                      guest: true,
                      name: e.target.value,
                    }
                    : undefined
                  )
                }}
                ref={guestInputRef}
                className={cn(
                  "transition-opacity",
                  participant && participant.guest && "border-primary ring-ring/50 ring-[1.5px]",
                  guestInputDisabled && "select-none"
                )}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key !== "Enter") return
                  e.preventDefault()
                  save()
                  if (setOpen) setOpen(false)
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                disabled={guestInputDisabled || !guest}
                onClick={() => {
                  if (!guest) return
                  setGuest("")
                  setParticipant(undefined)
                  guestInputRef.current?.focus()
                }}
                className={cn(
                  "size-6 absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity shrink-0",
                  guestInputDisabled || !guest
                    ? "!opacity-0 select-none"
                    : "opacity-100"
                )}
              >
                <XIcon />
              </Button>
            </div>

            {isExistingGuest && <span className="text-destructive text-sm">Guest already exists!</span>}
          </div>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
              onClick={() => {
                //* unset participant
                setParticipant(undefined)
                setGuest("")
              }}
            >
              <XIcon /> Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={!participant && !guest}
              // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
              onClick={save}
              className="transition-opacity"
            >
              <SaveIcon /> Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}

type ParticipantCardDetailsProps = {
  participant: TrackerParticipant | undefined
  user: User | undefined
}
const ParticipantCardDetails = ({ participant, user }: ParticipantCardDetailsProps) => {
  return (
    <>
      <Avatar className="size-9">
        <AvatarImage src={user && user.image || undefined}></AvatarImage>
        <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        {user
          ? <>
            <span className="font-medium text-sm leading-none">{user.displayUsername || user.name}</span>
            <span className="text-muted-foreground text-xs leading-none">{user.email}</span>
          </>
          : <>
            <span className="font-medium text-sm leading-none">{participant && participant.guest && participant.name}</span>
            <span className="text-muted-foreground text-xs italic leading-none">Guest</span>
          </>}
      </div>
    </>
  );
}
