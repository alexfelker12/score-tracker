import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { GameStatusSchema } from '../inputTypeSchemas/GameStatusSchema'
import { TrackerWithRelationsSchema } from './TrackerSchema'
import type { TrackerWithRelations } from './TrackerSchema'
import { GameParticipantWithRelationsSchema } from './GameParticipantSchema'
import type { GameParticipantWithRelations } from './GameParticipantSchema'

/////////////////////////////////////////
// GAME SCHEMA
/////////////////////////////////////////

export const GameSchema = z.object({
  status: GameStatusSchema,
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  /**
   * ![PrismaJson.TestJson1 | PrismaJson.TestJson2 | PrismaJson.TestJson3]
   */
  data: JsonValueSchema,
  trackerId: z.string(),
})

export type Game = z.infer<typeof GameSchema>

/////////////////////////////////////////
// GAME RELATION SCHEMA
/////////////////////////////////////////

export type GameRelations = {
  tracker: TrackerWithRelations;
  participants: GameParticipantWithRelations[];
};

export type GameWithRelations = z.infer<typeof GameSchema> & GameRelations

export const GameWithRelationsSchema: z.ZodType<GameWithRelations> = GameSchema.merge(z.object({
  tracker: z.lazy(() => TrackerWithRelationsSchema),
  participants: z.lazy(() => GameParticipantWithRelationsSchema).array(),
}))

export default GameSchema;
