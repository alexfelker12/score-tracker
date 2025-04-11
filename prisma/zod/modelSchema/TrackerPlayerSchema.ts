import { z } from 'zod';
import { TrackerWithRelationsSchema } from './TrackerSchema'
import type { TrackerWithRelations } from './TrackerSchema'
import { UserWithRelationsSchema } from './UserSchema'
import type { UserWithRelations } from './UserSchema'

/////////////////////////////////////////
// TRACKER PLAYER SCHEMA
/////////////////////////////////////////

export const TrackerPlayerSchema = z.object({
  id: z.string().cuid(),
  displayName: z.string(),
  trackerId: z.string(),
  playerId: z.string().nullable(),
})

export type TrackerPlayer = z.infer<typeof TrackerPlayerSchema>

/////////////////////////////////////////
// TRACKER PLAYER RELATION SCHEMA
/////////////////////////////////////////

export type TrackerPlayerRelations = {
  tracker: TrackerWithRelations;
  player?: UserWithRelations | null;
};

export type TrackerPlayerWithRelations = z.infer<typeof TrackerPlayerSchema> & TrackerPlayerRelations

export const TrackerPlayerWithRelationsSchema: z.ZodType<TrackerPlayerWithRelations> = TrackerPlayerSchema.merge(z.object({
  tracker: z.lazy(() => TrackerWithRelationsSchema),
  player: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

export default TrackerPlayerSchema;
