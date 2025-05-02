"use server"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma } from "@prisma/client/edge"


//*** GET
//* users by username
async function findUsersByUsername(userId: string, nameStart: string) {
  return await prisma.user.findMany({
    where: {
      id: {
        not: userId
      },
      OR: [
        {
          displayUsername: {
            startsWith: nameStart,
            mode: "insensitive" //? not default for postgresql
          }
        },
        {
          AND: [
            {
              displayUsername: null
            },
            {
              name: {
                startsWith: nameStart,
                mode: "insensitive" //? not default for postgresql
              },
            }
          ]
        }
      ],
    },
    orderBy: {
      displayUsername: "asc"
    }
  })
}
export type FindUsersByUsernameReturn = Prisma.PromiseReturnType<typeof findUsersByUsername>
export type FindUsersByUsernameArgs = Parameters<typeof findUsersByUsername>

export async function getUsersByUsername(...args: FindUsersByUsernameArgs) {
  const { data, error } = await tryCatch<FindUsersByUsernameReturn>(
    findUsersByUsername(...args)
  )

  if (error) return { error }

  return { data }
}


//* all users except self
async function findOtherUsers(userId: string) {
  return await prisma.user.findMany({
    where: {
      id: {
        not: userId
      },
    },
    orderBy: {
      displayUsername: {
        sort: "asc",
        nulls: "last"
      }
    }
  })
}
export type FindOtherUsersReturn = Prisma.PromiseReturnType<typeof findOtherUsers>
export type FindOtherUsersArgs = Parameters<typeof findOtherUsers>

export async function getOtherUsers(...args: FindOtherUsersArgs) {
  const { data, error } = await tryCatch<FindOtherUsersReturn>(
    findOtherUsers(...args)
  )

  if (error) return { error }

  return { data }
}
