import { z } from 'zod';
import { UserWithRelationsSchema } from './UserSchema'
import type { UserWithRelations } from './UserSchema'
import { GameWithRelationsSchema } from './GameSchema'
import type { GameWithRelations } from './GameSchema'

/////////////////////////////////////////
// GAME PARTICIPANT SCHEMA
/////////////////////////////////////////

export const GameParticipantSchema = z.object({
  id: z.string().cuid(),
  displayName: z.string(),
  userId: z.string().nullable(),
  gameId: z.string(),
})

export type GameParticipant = z.infer<typeof GameParticipantSchema>

/////////////////////////////////////////
// GAME PARTICIPANT RELATION SCHEMA
/////////////////////////////////////////

export type GameParticipantRelations = {
  user?: UserWithRelations | null;
  game: GameWithRelations;
};

export type GameParticipantWithRelations = z.infer<typeof GameParticipantSchema> & GameParticipantRelations

export const GameParticipantWithRelationsSchema: z.ZodType<GameParticipantWithRelations> = GameParticipantSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
  game: z.lazy(() => GameWithRelationsSchema),
}))

export default GameParticipantSchema;
