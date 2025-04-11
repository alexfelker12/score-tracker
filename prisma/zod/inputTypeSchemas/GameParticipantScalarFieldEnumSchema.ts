import { z } from 'zod';

export const GameParticipantScalarFieldEnumSchema = z.enum(['id','displayName','userId','gameId']);

export default GameParticipantScalarFieldEnumSchema;
