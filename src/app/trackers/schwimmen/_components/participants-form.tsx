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

import { PlusIcon, Trash2Icon } from "lucide-react"


const MIN_PLAYERS = 2
const MAX_PLAYERS = 11

export const zPlayerName = z.string().min(1, {
  message: "This field may not be empty"
})

export const participantsSchema = z.object({
  players: z.array(
    z.object({
      name: zPlayerName
    })
  ).min(MIN_PLAYERS).max(MAX_PLAYERS),
})

const HANDLEDKEYDOWNKEYS = ["Enter", "Backspace", "Delete"]


export const ParticipantsForm = () => {
  //* refs, for manual focus handling
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

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
      minLength: MIN_PLAYERS,
      maxLength: MAX_PLAYERS
    }
  });

  const canAddfield = form.getValues("players").length < MAX_PLAYERS
  const canDelField = form.getValues("players").length > MIN_PLAYERS
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

  async function onSubmit(values: z.infer<typeof participantsSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`players.${index}.name`}
              //* filter out ref from form
              render={({ field: { ref: _, ...field } }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex space-x-2">
                      {/* <Test /> */}
                      <Input
                        className="px-2 h-8"
                        autoComplete="off"
                        placeholder={`Player ${index + 1}`}
                        //* pass own ref
                        ref={(el) => { inputRefs.current[index] = el }}
                        {...field}
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
            onClick={() => { if (canAddfield) append({ name: "" }) }}
            className="justify-start !pl-2 w-auto h-8 text-muted-foreground"
          >
            <PlusIcon className="size-5" /> Add player
          </Button>

        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
          >
            Create Round
          </Button>
        </div>

      </form>
    </Form>
  );
}