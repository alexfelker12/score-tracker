import { z } from 'zod';
import { GameStatusSchema } from '../inputTypeSchemas/GameStatusSchema'
import { TrackerWithRelationsSchema } from './TrackerSchema'
import type { TrackerWithRelations } from './TrackerSchema'
import { GameDataWithRelationsSchema } from './GameDataSchema'
import type { GameDataWithRelations } from './GameDataSchema'
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
})

export type Game = z.infer<typeof GameSchema>

/////////////////////////////////////////
// GAME RELATION SCHEMA
/////////////////////////////////////////

export type GameRelations = {
  tracker: TrackerWithRelations;
  gameData?: GameDataWithRelations | null;
  participants: GameParticipantWithRelations[];
  rounds: GameRoundWithRelations[];
};

export type GameWithRelations = z.infer<typeof GameSchema> & GameRelations

export const GameWithRelationsSchema: z.ZodType<GameWithRelations> = GameSchema.merge(z.object({
  tracker: z.lazy(() => TrackerWithRelationsSchema),
  gameData: z.lazy(() => GameDataWithRelationsSchema).nullable(),
  participants: z.lazy(() => GameParticipantWithRelationsSchema).array(),
  rounds: z.lazy(() => GameRoundWithRelationsSchema).array(),
}))

export default GameSchema;
