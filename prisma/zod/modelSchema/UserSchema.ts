import { z } from 'zod';
import { SessionWithRelationsSchema } from './SessionSchema'
import type { SessionWithRelations } from './SessionSchema'
import { AccountWithRelationsSchema } from './AccountSchema'
import type { AccountWithRelations } from './AccountSchema'
import { TrackerWithRelationsSchema } from './TrackerSchema'
import type { TrackerWithRelations } from './TrackerSchema'
import { TrackerPlayerWithRelationsSchema } from './TrackerPlayerSchema'
import type { TrackerPlayerWithRelations } from './TrackerPlayerSchema'
import { GameParticipantWithRelationsSchema } from './GameParticipantSchema'
import type { GameParticipantWithRelations } from './GameParticipantSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string().nullable(),
  displayUsername: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  sessions: SessionWithRelations[];
  accounts: AccountWithRelations[];
  creator: TrackerWithRelations[];
  trackerPlayer: TrackerPlayerWithRelations[];
  gameParticipant: GameParticipantWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  accounts: z.lazy(() => AccountWithRelationsSchema).array(),
  creator: z.lazy(() => TrackerWithRelationsSchema).array(),
  trackerPlayer: z.lazy(() => TrackerPlayerWithRelationsSchema).array(),
  gameParticipant: z.lazy(() => GameParticipantWithRelationsSchema).array(),
}))

export default UserSchema;
