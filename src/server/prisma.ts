// import { PrismaClient } from "@prisma/client"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export const caching = {
  cacheStrategy: {
    // ttl: 60, // Time-to-live in seconds
    // swr: 60, // Stale-while-revalidate duration in seconds
  },
}
