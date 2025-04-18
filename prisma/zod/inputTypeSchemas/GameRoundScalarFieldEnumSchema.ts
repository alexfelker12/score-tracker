import { z } from 'zod';

export const GameRoundScalarFieldEnumSchema = z.enum(['data','round','gameId']);

export default GameRoundScalarFieldEnumSchema;
