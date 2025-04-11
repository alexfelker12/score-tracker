"use server"

import { caching, prisma } from "@/server/prisma"
import { Prisma, TrackerType } from "@prisma/client/edge"



//* GET all trackers created today
async function findTodaysTrackers(trackerType: TrackerType) {
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)

  const queryArgs: Prisma.TrackerFindManyArgs = {
    where: {
      type: trackerType,
      createdAt: {
        gte: midnight.toISOString()
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    ...caching
  }

  return await prisma.tracker.findMany(queryArgs)
}
export type GetAllTodaysTrackersReturn = Prisma.PromiseReturnType<typeof findTodaysTrackers>
export type FindTodaysTrackersArgs = Parameters<typeof findTodaysTrackers>

export async function getAllTodaysTrackers(args: FindTodaysTrackersArgs[0]) {
  try {
    const data = await findTodaysTrackers(args)
    return { data }
  } catch (error) { return { error } }
}

//* GET all trackers created in the past
async function findPastTrackers(trackerType: TrackerType) {
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)

  const queryArgs: Prisma.TrackerFindManyArgs = {
    where: {
      type: trackerType,
      createdAt: {
        lt: midnight.toISOString()
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    ...caching
  }

  return await prisma.tracker.findMany(queryArgs)
}
export type GetAllPastTrackersReturn = Prisma.PromiseReturnType<typeof findPastTrackers>
export type FindPastTrackersArgs = Parameters<typeof findPastTrackers>

export async function getAllPastTrackers(args: FindPastTrackersArgs[0]) {
  try {
    const data = await findPastTrackers(args)
    return { data }
  } catch (error) { return { error } }
}


//* GET all trackers 
async function findTrackers(trackerType: TrackerType) {
  const queryArgs: Prisma.TrackerFindManyArgs = {
    where: {
      type: trackerType,
    },
    orderBy: {
      createdAt: "desc"
    },
    ...caching
  }
  return await prisma.tracker.findMany(queryArgs)
}
export type GetAllTrackersReturn = Prisma.PromiseReturnType<typeof findTrackers>
export type FindTrackersArgs = Parameters<typeof findTrackers>

export async function getAllTrackers(args: FindTrackersArgs[0]) {
  try {
    const data = await findTrackers(args)
    return { data }
  } catch (error) { return { error } }
}



//* GET single tracker
async function findTrackerById(trackerId: Prisma.TrackerWhereInput["id"]) {
  const queryArgs: Prisma.TrackerFindFirstArgs = {
    where: {
      id: trackerId
    },
    ...caching
  }

  return await prisma.tracker.findFirst(queryArgs)
}
export type GetTrackerReturn = Prisma.PromiseReturnType<typeof findTrackerById>
export type GetTrackerByIdArgs = Parameters<typeof findTrackerById>

export async function getTrackerById(args: GetTrackerByIdArgs[0]) {
  try {
    const data = await findTrackerById(args)
    return { data }
  } catch (error) { return { error } }
}



//* POST create tracker
async function createSingleTracker(createData: Prisma.TrackerCreateArgs["data"]) {
  const createArgs: Prisma.TrackerCreateArgs = {
    data: createData
  }

  return await prisma.tracker.create(createArgs)
}
export type CreateSingleTrackerReturn = Prisma.PromiseReturnType<typeof createSingleTracker>
export type CreateSingleTrackerArgs = Parameters<typeof createSingleTracker>

export async function createTracker(args: CreateSingleTrackerArgs[0]) {
  // try {
  const data = await createSingleTracker(args)
  return { data }
  // } catch (error) { return { error } }
}



//* POST delete tracker
async function deleteSingleTracker(trackerId: Prisma.TrackerDeleteArgs["where"]["id"]) {
  const deleteArgs: Prisma.TrackerDeleteArgs = {
    where: {
      id: trackerId
    }
  }
  return await prisma.tracker.delete(deleteArgs)
}
export type DeleteTrackerReturn = Prisma.PromiseReturnType<typeof deleteSingleTracker>
export type DeleteSingleTrackerArgs = Parameters<typeof deleteSingleTracker>

export async function deleteTracker(args: DeleteSingleTrackerArgs[0]) {
  try {
    const data = await deleteSingleTracker(args)
    return { data }
  } catch (error) { return { error } }
}
