import { z } from "zod"

export const zPlayerName = z.string().min(1, {
  message: "This field may not be empty"
})

export const participantsSchemaBase = z.object({
  players: z.array(
    z.object({
      name: zPlayerName
    })
  )
})
