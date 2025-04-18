import { z } from 'zod';

export const GameDataScalarFieldEnumSchema = z.enum(['data','gameId']);

export default GameDataScalarFieldEnumSchema;
