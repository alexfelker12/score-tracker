import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { GameStatusSchema } from '../inputTypeSchemas/GameStatusSchema'
import { TrackerWithRelationsSchema } from './TrackerSchema'
import type { TrackerWithRelations } from './TrackerSchema'
import { GameParticipantWithRelationsSchema } from './GameParticipantSchema'
import type { GameParticipantWithRelations } from './GameParticipantSchema'
import { GameRoundWithRelationsSchema } from './GameRoundSchema'
import type { GameRoundWithRelations } from './GameRoundSchema'

/////////////////////////////////////////
// GAME SCHEMA
/////////////////////////////////////////

export const GameSchema = z.object({
  status: GameStatusSchema,
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  trackerId: z.string(),
  /**
   * ![PrismaJson.GameData]
   */
  gameData: JsonValueSchema,
})

export type Game = z.infer<typeof GameSchema>

/////////////////////////////////////////
// GAME RELATION SCHEMA
/////////////////////////////////////////

export type GameRelations = {
  tracker: TrackerWithRelations;
  participants: GameParticipantWithRelations[];
  rounds: GameRoundWithRelations[];
};

export type GameWithRelations = z.infer<typeof GameSchema> & GameRelations

export const GameWithRelationsSchema: z.ZodType<GameWithRelations> = GameSchema.merge(z.object({
  tracker: z.lazy(() => TrackerWithRelationsSchema),
  participants: z.lazy(() => GameParticipantWithRelationsSchema).array(),
  rounds: z.lazy(() => GameRoundWithRelationsSchema).array(),
}))

export default GameSchema;
