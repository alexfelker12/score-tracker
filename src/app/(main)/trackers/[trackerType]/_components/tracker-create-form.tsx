"use client"

import React, { Suspense } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { AddPlayerDialog, TrackerParticipant } from "@/components/ui/trackers/add-player-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/auth"
import { getQueryClient } from "@/lib/get-query-client"
import { isUniqueKey } from "@/lib/utils"
import { participantsSchema } from "@/schema/participants"
import { createTracker } from "@/server/actions/tracker/actions"
import { TrackerType } from "@prisma/client/edge"
import { useMutation } from "@tanstack/react-query"
import { ClipboardPlusIcon, Loader2Icon, Trash2Icon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { User } from "prisma/zod/modelSchema/UserSchema"
import { toast } from "sonner"
import { getOtherUsers } from "@/server/actions/user/actions"

//* types
export type TrackerFormType = {
  session: typeof auth.$Infer.Session
  trackerType: TrackerType
  dataPromise: ReturnType<typeof getOtherUsers>
  onSubmit?: (values: z.infer<typeof participantsSchema>) => Promise<void>
}


//* main
export const TrackerForm = ({ session, trackerType, dataPromise }: TrackerFormType) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [subOpen, setSubOpen] = React.useState<boolean>(false)

  const router = useRouter()
  const qc = getQueryClient()

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
        setOpen(false)

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
  })


  // form on submit
  function defaultOnSubmit(values: z.infer<typeof participantsSchema>) {
    const { players, displayName } = values

    setOpen(false)
    mutate({
      displayName,
      trackerType,
      players,
      creatorId: session.user.id,
    })
  }

  const handleSave = (participant: TrackerParticipant) => {
    form.clearErrors("root")
    append(participant)
  }

  // console.log(subOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ClipboardPlusIcon /> New tracker
        </Button>
      </DialogTrigger>

      <DialogContent hidden={subOpen}>
        <DialogHeader>
          <DialogTitle>Create a tracker</DialogTitle>
          <DialogDescription>Choose a name. Participants can always be added later in the tracker</DialogDescription>
        </DialogHeader>

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
                <h3 className="font-medium text-base">Participants</h3>
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

              <Suspense fallback={<Skeleton className="w-32 h-9" />}>
                <AddPlayerDialog
                  userId={session.user.id}
                  saveFunc={handleSave}
                  userPlayers={players.flatMap((participant) => !participant.guest ? participant.user.id : [])}
                  guestPlayers={players.flatMap((participant) => participant.guest ? participant.name : [])}
                  dataPromise={dataPromise}
                  open={subOpen}
                  setOpen={setSubOpen}
                />
              </Suspense>

            </div>

            {form.formState.errors.root &&
              <p className="text-destructive">{form.formState.errors.root.message}</p>
            }

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
      </DialogContent>
    </Dialog>
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
