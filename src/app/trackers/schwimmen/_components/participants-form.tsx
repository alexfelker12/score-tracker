"use client"

import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { ClipboardPlusIcon, Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { createTracker } from "@/server/actions/trackerActions"
import { Prisma } from "@prisma/client/edge"
import { useRouter } from "next/navigation"
import { participantsSchemaBase, zPlayerName } from "@/schema/participants"


// const MIN_PLAYERS = 2
// const MAX_PLAYERS = 11

const HANDLEDKEYDOWNKEYS = ["Enter", "Backspace", "Delete"]

export type ParticipantsFormType = {
  minPlayers: number
  maxPlayers: number
  onSubmit?: (values: z.infer<typeof participantsSchemaBase>) => Promise<void>
}

export const ParticipantsForm = ({ minPlayers, maxPlayers }: ParticipantsFormType) => {
  //* Memoized schema with dynamic min/max
  const participantsSchema = React.useMemo(() => {
    return participantsSchemaBase.extend({
      players: participantsSchemaBase.shape.players.min(minPlayers).max(maxPlayers),
    });
  }, [minPlayers, maxPlayers]);

  const form = useForm<z.infer<typeof participantsSchema>>({
    resolver: zodResolver(participantsSchema),
    defaultValues: {
      players: [
        { name: "" },
        { name: "" }
      ]
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "players",
    rules: {
      minLength: minPlayers,
      maxLength: maxPlayers
    }
  });

  //* refs, for manual focus handling
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  //* router for redirect after create
  const router = useRouter()

  //* form logic
  const canAddfield = form.getValues("players").length < maxPlayers
  const canDelField = form.getValues("players").length > minPlayers
  const isLastField = (index: number) => fields.length === index + 1
  const isFirstField = (index: number) => !index //? simple truthy check

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, fieldIndex: number) => {
    if (!HANDLEDKEYDOWNKEYS.includes(e.key)) return

    const fieldValue = form.getValues(`players.${fieldIndex}.name`)
    const isInValid = !zPlayerName.safeParse(fieldValue).success

    switch (e.key) {
      case "Enter":
        //* only handle enter, if not on last field and fields can be added
        if (isLastField(fieldIndex) && !canAddfield) return
        e.preventDefault()

        //* if field is invalid, stop handling
        if (isInValid) return

        //* else check if on last field and can add field, add field if so
        if (isLastField(fieldIndex) && canAddfield) {
          append({ name: "" })
          setTimeout(() => {
            inputRefs.current[fieldIndex + 1]?.focus()
          }, 0)
        } else {
          //* if not, set focus to next element
          // form.setFocus(`players.${fieldIndex + 1}.name`)
          setTimeout(() => {
            inputRefs.current[fieldIndex + 1]?.focus()
          }, 0)
        }
        break;

      case "Backspace":
        //* only handle back, if not on first field or field is empty and can be deleted
        if (isFirstField(fieldIndex) || fieldValue) return
        e.preventDefault()

        //* only remove field, if fields can be deleted
        if (canDelField) { remove(fieldIndex) }

        //* always focus previous field
        // form.setFocus(`players.${fieldIndex - 1}.name`)
        setTimeout(() => {
          inputRefs.current[fieldIndex - 1]?.focus()
        }, 0)
        break;

      // //? currently on hold
      // case "Delete":
      //   //* only handle del, if 
      //   // 1. input is not empty     and
      //   // 2. fields can be deleted 
      //   if (!fieldValue && !canDelField) return
      //   remove(fieldIndex)
      //   break;
    }
  }

  //* POST mutation: tracker
  const { mutate, isPending } = useMutation({
    // mutationKey: ["create-tracker"],
    mutationFn: createTracker,
    onSettled: (data, error, variables, context) => {
      if (!error && data) {
        const redirectUrl = `/trackers/schwimmen/${data.data?.id}`
        router.push(redirectUrl)
      }
    },
  })

  // form on submit
  async function defaultOnSubmit(values: z.infer<typeof participantsSchemaBase>) {
    const participants = values.players as Prisma.JsonArray
    const newTracker = await mutate({
      data: {
        name: "SCHWIMMEN",
        playerData: participants
      }
    })
  }

  return (
    <Form {...form}>
      {/* onSubmit ??= defaultOnSubmit */}
      <form onSubmit={form.handleSubmit(defaultOnSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`players.${index}.name`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex space-x-2">
                      {/* <Test /> */}
                      <Input
                        className="px-2 h-8"
                        autoComplete="off"
                        placeholder={`Player ${index + 1}`}
                        // {...field}
                        //* pass own ref
                        ref={(el) => { inputRefs.current[index] = el }}
                        //* filter out ref from form
                        {...Object.fromEntries(Object.entries(field).filter(([key]) => key !== "ref"))} // Removes `ref`
                        onKeyDown={(e) => { handleInputKeyDown(e, index) }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={!canDelField}
                        // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        onClick={() => { if (canDelField) remove(index) }}
                        className="transition-opacity size-8"
                      ><Trash2Icon className="size-5" /></Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant="ghost"
            disabled={!canAddfield}
            // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            onClick={() => {
              if (canAddfield) {
                append({ name: "" })
                setTimeout(() => {
                  // after append focus last field
                  inputRefs.current[inputRefs.current.length - 1]?.focus()
                }, 0)
              }
            }}
            className="justify-start !pl-2 w-auto h-8 text-muted-foreground"
          >
            <PlusIcon className="size-5" /> Add player
          </Button>

        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
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