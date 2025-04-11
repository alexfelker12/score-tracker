import { z } from 'zod';
import { TrackerTypeSchema } from '../inputTypeSchemas/TrackerTypeSchema'
import { UserWithRelationsSchema } from './UserSchema'
import type { UserWithRelations } from './UserSchema'
import { TrackerPlayerWithRelationsSchema } from './TrackerPlayerSchema'
import type { TrackerPlayerWithRelations } from './TrackerPlayerSchema'
import { GameWithRelationsSchema } from './GameSchema'
import type { GameWithRelations } from './GameSchema'

/////////////////////////////////////////
// TRACKER SCHEMA
/////////////////////////////////////////

export const TrackerSchema = z.object({
  type: TrackerTypeSchema,
  id: z.string().cuid(),
  displayName: z.string(),
  archived: z.boolean(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  creatorId: z.string(),
})

export type Tracker = z.infer<typeof TrackerSchema>

/////////////////////////////////////////
// TRACKER RELATION SCHEMA
/////////////////////////////////////////

export type TrackerRelations = {
  creator: UserWithRelations;
  players: TrackerPlayerWithRelations[];
  games: GameWithRelations[];
};

export type TrackerWithRelations = z.infer<typeof TrackerSchema> & TrackerRelations

export const TrackerWithRelationsSchema: z.ZodType<TrackerWithRelations> = TrackerSchema.merge(z.object({
  creator: z.lazy(() => UserWithRelationsSchema),
  players: z.lazy(() => TrackerPlayerWithRelationsSchema).array(),
  games: z.lazy(() => GameWithRelationsSchema).array(),
}))

export default TrackerSchema;
