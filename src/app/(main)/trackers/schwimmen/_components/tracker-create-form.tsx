"use client"

import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/auth"
import { getQueryClient } from "@/lib/get-query-client"
import { cn, isUniqueKey } from "@/lib/utils"
import { participantsSchemaBase } from "@/schema/participants"
import { createTracker } from "@/server/actions/tracker/actions"
import { getOtherUsers } from "@/server/actions/user/actions"
import { TrackerType } from "@prisma/client/edge"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ClipboardPlusIcon, Loader2Icon, PlusIcon, SaveIcon, Trash2Icon, UserIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User } from "prisma/zod/modelSchema/UserSchema"

//* types
export type TrackerFormType = {
  session: typeof auth.$Infer.Session
  minPlayers: number
  maxPlayers: number
  trackerType: TrackerType
  onSubmit?: (values: z.infer<typeof participantsSchemaBase>) => Promise<void>
}

type TrackerParticipant = z.infer<typeof participantsSchemaBase.shape.players>[0]

export type AddPlayerDialogType = {
  userId: string
  saveFunc: (participant: TrackerParticipant) => void
  canAddField?: boolean
  userPlayers: string[]
  guestPlayers: string[]
}

//* main
export const TrackerForm = ({ session, minPlayers, maxPlayers, trackerType }: TrackerFormType) => {

  //* Memoized schema with dynamic min/max
  const participantsSchema = React.useMemo(() => {
    return participantsSchemaBase.extend({
      players: participantsSchemaBase.shape.players.min(minPlayers).max(maxPlayers),
    })
  }, [minPlayers, maxPlayers]);

  const form = useForm<z.infer<typeof participantsSchema>>({
    resolver: zodResolver(participantsSchema),
    defaultValues: {
      displayName: "",
      players: [{
        guest: false,
        user: session.user
      }]
    },
  })

  const { fields: players, append, remove } = useFieldArray({
    control: form.control,
    name: "players",
    rules: {
      minLength: minPlayers,
      maxLength: maxPlayers
    }
  })

  //* router for redirect after create
  const router = useRouter()

  //* query client
  const qc = getQueryClient()

  //* form logic
  const canAddfield = form.getValues("players").length < maxPlayers
  const canDelField = form.getValues("players").length > minPlayers

  //* POST mutation: tracker
  const { mutate, isPending } = useMutation({
    mutationKey: ['tracker-create', trackerType],
    mutationFn: createTracker,
    onSettled: async (data) => {
      if (!data) return;

      if (data.data) {
        const redirectUrl = `/trackers/schwimmen/${data.data.id}-${encodeURIComponent(data.data.displayName)}`

        toast.success("Tracker was created successfully", {
          action: {
            label: "Go to tracker",
            onClick: () => router.push(redirectUrl)
          }
        })

        form.reset()

        //* invalidate query to refetch latest data
        await qc.invalidateQueries({ queryKey: ["trackers", trackerType] })
      } else if (data.error) {
        if (data.error.code === "P2002" && data.error.meta) {
          const errorMessage = isUniqueKey(data.error.meta.target as string[], ["trackerId", "displayName"])
            ? "Participant names must be unique"
            : "There are duplicate unique values"

          toast.error("Tracker could not be created", {
            description: errorMessage
          })

          form.setError("root", {
            message: errorMessage
          })
        }
      }
    },
  })

  // form on submit
  function defaultOnSubmit(values: z.infer<typeof participantsSchemaBase>) {
    const { players, displayName } = values

    if (session) mutate({
      displayName,
      trackerType,
      players,
      creatorId: session.user.id,
    })
  }

  const handleSave = (participant: TrackerParticipant) => {
    if (!canAddfield) return;
    
    form.clearErrors("root")
    append(participant)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(defaultOnSubmit)} className="flex flex-col gap-4 sm:gap-0">
        <div className="flex flex-wrap gap-2">

          <FormField control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="mb-4 w-full">
                <FormLabel className="text-base data-[error=true]:text-destructive">Name</FormLabel>
                <FormControl>
                  {/* <Test /> */}
                  <Input
                    className="px-2 h-8"
                    autoComplete="off"
                    placeholder="Tracker name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>By this name you can associate your tracker later on and find it in your list</FormDescription>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 w-full">
            <h3 className="font-medium text-base">Participants (at least {minPlayers})</h3>
            <div className="gap-2 grid sm:grid-cols-2">
              {players.map((participant, index) => (
                <div
                  key={participant.id}
                  className="relative flex justify-between outline-hidden bg-background shadow-sm px-2 py-1.5 border rounded-lg text-sm cursor-default select-none"
                >
                  <div className="flex items-center gap-2">
                    <ParticipantCardDetails
                      participant={participant}
                      user={!participant.guest ? participant.user : undefined}
                    />
                  </div>

                  {participant.guest || !participant.guest && participant.user.id !== session.user.id
                    ? <Button
                      variant="ghost"
                      size="icon"
                      disabled={!canDelField}
                      onClick={() => {
                        remove(index)
                        form.clearErrors("root")
                      }}
                    ><Trash2Icon /></Button>
                    : <div className="place-items-center grid size-9">
                      <span className="text-muted-foreground text-sm italic">you</span>
                    </div>}
                </div>
              ))}
            </div>
          </div>

          {session
            ? <AddPlayerDialog
              userId={session.user.id}
              saveFunc={handleSave}
              canAddField={canAddfield}
              userPlayers={players.flatMap((participant) => !participant.guest ? participant.user.id : [])}
              guestPlayers={players.flatMap((participant) => participant.guest ? participant.name : [])}
            />
            : <Skeleton className="w-28 h-8" />
          }

        </div>

        <p className="text-destructive">
          {form.formState.errors.root && form.formState.errors.root.message}
        </p>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isPending}
          >
            {isPending ?
              <Loader2Icon className="animate-spin" />
              :
              <ClipboardPlusIcon />
            }
            Create tracker
          </Button>
        </div>

      </form>
    </Form>
  );
}

export const AddPlayerDialog = ({ userId, saveFunc, canAddField, userPlayers, guestPlayers }: AddPlayerDialogType) => {
  const [participant, setParticipant] = React.useState<TrackerParticipant>()
  const [guest, setGuest] = React.useState<string>("")
  const guestInputRef = React.useRef<HTMLInputElement>(null)

  //* GET users by username
  const { data, isFetching } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getOtherUsers(userId),
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const guestInputDisabled = participant && !participant.guest
  const isExistingGuest = participant && participant.guest && guestPlayers.includes(guest)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="justify-start !pl-2 w-auto h-8 text-muted-foreground"
          disabled={!canAddField}
        >
          <PlusIcon className="size-5" /> Add player
        </Button>
      </DialogTrigger>
      <DialogContent>
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
              placeholder="Search for a player..."
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
                placeholder="Guest player name"
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
              onClick={() => {
                if (!participant || isExistingGuest) return;

                //* execute passed function
                saveFunc(participant)

                //* unset participant afterwards
                setParticipant(undefined)
                setGuest("")
              }}
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
