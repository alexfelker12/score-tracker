import { z } from 'zod';

export const GameParticipantScalarFieldEnumSchema = z.enum(['id','displayName','gameId','userId']);

export default GameParticipantScalarFieldEnumSchema;
