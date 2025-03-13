"use server"

import { prisma } from "@/server/prisma"
import { Prisma } from "@prisma/client/edge"

//* GET all trackers
export async function getAllTrackers() {
  try {
    const data = await prisma.tracker.findMany()
    return { data }
  } catch (error) { return { error } }
}

//* GET all trackers by argument
async function findTrackersByArg(findTrackerByArgArgs: Prisma.TrackerFindManyArgs) {
  return await prisma.tracker.findMany(findTrackerByArgArgs)
}
export type GetTrackerByArgReturnType = Prisma.PromiseReturnType<typeof findTrackersByArg>
export async function getAllTrackersByArg(findTrackerByArgArgs: Prisma.TrackerFindManyArgs) {
  try {
    const data = await findTrackersByArg(findTrackerByArgArgs)
    return { data }
  } catch (error) { return { error } }
}

//* GET single tracker
async function findTracker(findTrackerArgs: Prisma.TrackerFindFirstArgs) {
  return await prisma.tracker.findFirst(findTrackerArgs)
}
export type GetTrackerReturnType = Prisma.PromiseReturnType<typeof findTracker>
export async function getTracker(findTrackerArgs: Prisma.TrackerFindFirstArgs) {
  try {
    const data = await findTracker(findTrackerArgs)
    return { data }
  } catch (error) { return { error } }
}

//* POST create tracker
async function createSingleTracker(createTrackerArgs: Prisma.TrackerCreateArgs) {
  return await prisma.tracker.create(createTrackerArgs)
}
export type CreateTrackerReturnType = Prisma.PromiseReturnType<typeof createSingleTracker>
export async function createTracker(createTrackerArgs: Prisma.TrackerCreateArgs) {
  try {
    const data = await createSingleTracker(createTrackerArgs)
    return { data }
  } catch (error) { return { error } }
}
