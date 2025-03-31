import { z } from "zod"

export const zPlayerName = z.string().min(1, {
  message: "This field may not be empty"
})

export const participantsSchemaBase = z.object({
  displayName: z.string().min(1),
  players: z.array(
    z.object({
      userId: z.string().optional(),
      name: zPlayerName
    })
  )
})
