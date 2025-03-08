"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Trash2Icon } from "lucide-react"

const MIN_PLAYERS = 1
const MAX_PLAYERS = 11

export const ParticipantSchema = z.object({
  players: z.array(
    z.object({
      name: z.string().min(1, {
        message: "This field may not be empty"
      })
    })
  ).min(MIN_PLAYERS).max(MAX_PLAYERS),
})


export const ParticipantsForm = () => {
  const form = useForm<z.infer<typeof ParticipantSchema>>({
    resolver: zodResolver(ParticipantSchema),
    defaultValues: {
      players: [{ name: "" }]
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "players",
  });

  async function onSubmit(values: z.infer<typeof ParticipantSchema>) {
    console.log(values)
  }

  const canAddPlayer = form.getValues("players").length < MAX_PLAYERS
  const canDelPlayer = form.getValues("players").length > MIN_PLAYERS

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                      <Input
                        className="h-8"
                        {...field}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          e.preventDefault()
                          switch (e.key) {
                            case "Enter":
                              if (canAddPlayer) append({ name: "" })
                              break
                            case "Backspace":
                            case "Delete":
                              if (canDelPlayer) remove(index)
                              if (index) form.setFocus(`players.${index - 1}.name`)
                          }
                        }}
                        autoComplete="off"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={!canDelPlayer}
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                          if (canDelPlayer) remove(index)
                        }}
                        className="transition-opacity size-8"
                      ><Trash2Icon className="size-5" /></Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant="ghost"
            disabled={!canAddPlayer}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              if (canAddPlayer) append({ name: "" })
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
          >
            Create Round
          </Button>
        </div>
      </form>
    </Form>
  );
}