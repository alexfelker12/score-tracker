import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { GameWithRelationsSchema } from './GameSchema'
import type { GameWithRelations } from './GameSchema'

/////////////////////////////////////////
// GAME ROUND SCHEMA
/////////////////////////////////////////

export const GameRoundSchema = z.object({
  /**
   * ![PrismaJson.RoundData]
   */
  data: JsonValueSchema,
  round: z.number().int(),
  gameId: z.string(),
})

export type GameRound = z.infer<typeof GameRoundSchema>

/////////////////////////////////////////
// GAME ROUND RELATION SCHEMA
/////////////////////////////////////////

export type GameRoundRelations = {
  game: GameWithRelations;
};

export type GameRoundWithRelations = z.infer<typeof GameRoundSchema> & GameRoundRelations

export const GameRoundWithRelationsSchema: z.ZodType<GameRoundWithRelations> = GameRoundSchema.merge(z.object({
  game: z.lazy(() => GameWithRelationsSchema),
}))

export default GameRoundSchema;
