import { z } from 'zod';
import { GameWithRelationsSchema } from './GameSchema'
import type { GameWithRelations } from './GameSchema'
import { UserWithRelationsSchema } from './UserSchema'
import type { UserWithRelations } from './UserSchema'

/////////////////////////////////////////
// GAME PARTICIPANT SCHEMA
/////////////////////////////////////////

export const GameParticipantSchema = z.object({
  id: z.string().cuid(),
  displayName: z.string(),
  order: z.number().int().nullable(),
  gameId: z.string(),
  userId: z.string().nullable(),
})

export type GameParticipant = z.infer<typeof GameParticipantSchema>

/////////////////////////////////////////
// GAME PARTICIPANT RELATION SCHEMA
/////////////////////////////////////////

export type GameParticipantRelations = {
  game: GameWithRelations;
  user?: UserWithRelations | null;
};

export type GameParticipantWithRelations = z.infer<typeof GameParticipantSchema> & GameParticipantRelations

export const GameParticipantWithRelationsSchema: z.ZodType<GameParticipantWithRelations> = GameParticipantSchema.merge(z.object({
  game: z.lazy(() => GameWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

export default GameParticipantSchema;
