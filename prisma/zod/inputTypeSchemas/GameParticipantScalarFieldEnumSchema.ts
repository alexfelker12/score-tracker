import { z } from 'zod';

export const GameParticipantScalarFieldEnumSchema = z.enum(['id','displayName','order','gameId','userId']);

export default GameParticipantScalarFieldEnumSchema;
