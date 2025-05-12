"use server"

import { headers } from "next/headers"

import { tryCatch } from "@/server/helpers/try-catch"
import { prisma } from "@/server/prisma"
import { Prisma } from "@prisma/client/edge"

import { auth } from "@/lib/auth"


//*** GET
//* user data by userId
async function findUserDataById(params: {
  userId: string
}) {
  const { userId } = params

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("401: Not authenticated.")
  }

  if (session.user.id !== userId) {
    throw new Error("403: Not authorized.")
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!userData) {
    throw new Error("404: User not found.")
  }

  return userData
}
export type FindUserDataByIdReturn = Prisma.PromiseReturnType<typeof findUserDataById>
export type FindUserDataByIdArgs = Parameters<typeof findUserDataById>

export async function getUserDataById(...args: FindUserDataByIdArgs) {
  const { data, error } = await tryCatch<FindUserDataByIdReturn>(
    findUserDataById(...args)
  )

  if (error) {
    const errorCode = error.message.split(":")[0]
    return {
      error: {
        code: errorCode,
        message: error.message
      }
    }
  }

  return { data }
}


//*** PUT
//* update user data
// async function updateUserData(params: {
//   userId: string
// }) {
//   const { userId } = params

//   const session = await auth.api.getSession({
//     headers: await headers()
//   })

//   if (!session) {
//     throw new Error("401: Not authenticated.")
//   }

//   if (session.user.id !== userId) {
//     throw new Error("403: Not authorized.")
//   }


// }
// export type UpdateUserDataReturn = Prisma.PromiseReturnType<typeof updateUserData>
// export type UpdateUserDataArgs = Parameters<typeof updateUserData>

// export async function updateUserDataById(...args: UpdateUserDataArgs) {
//   const { data, error } = await tryCatch<UpdateUserDataReturn>(
//     updateUserData(...args)
//   )

//   if (error) {
//     const errorCode = error.message.split(":")[0]
//     return {
//       error: {
//         code: errorCode,
//         message: error.message
//       }
//     }
//   }

//   return { data }
// }
