import { UserSchema } from "prisma/generated/zod"
import { z } from "zod"

// export const participantsSchemaBase = z.object({
//   displayName: z.string().min(1),
//   players: z.array(
//     z.object({
//       guest: z.boolean(),
//       name: z.string().min(1, {
//         message: "This field may not be empty"
//       })
//     })
//   )
// })

export const participantsSchemaBase = z.object({
  displayName: z.string().min(1, {
    message: "This field may not be empty"
  }),
  players: z.array(
    z.discriminatedUnion("guest", [
      z.object({
        guest: z.literal(true),
        name: z.string().min(1)
      }),
      z.object({
        guest: z.literal(false),
        user: UserSchema
      })
    ])
  )
})
