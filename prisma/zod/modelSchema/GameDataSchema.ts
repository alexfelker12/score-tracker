import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { GameWithRelationsSchema } from './GameSchema'
import type { GameWithRelations } from './GameSchema'

/////////////////////////////////////////
// GAME DATA SCHEMA
/////////////////////////////////////////

export const GameDataSchema = z.object({
  /**
   * ![PrismaJson.GameData]
   */
  data: JsonValueSchema,
  gameId: z.string(),
})

export type GameData = z.infer<typeof GameDataSchema>

/////////////////////////////////////////
// GAME DATA RELATION SCHEMA
/////////////////////////////////////////

export type GameDataRelations = {
  game: GameWithRelations;
};

export type GameDataWithRelations = z.infer<typeof GameDataSchema> & GameDataRelations

export const GameDataWithRelationsSchema: z.ZodType<GameDataWithRelations> = GameDataSchema.merge(z.object({
  game: z.lazy(() => GameWithRelationsSchema),
}))

export default GameDataSchema;
