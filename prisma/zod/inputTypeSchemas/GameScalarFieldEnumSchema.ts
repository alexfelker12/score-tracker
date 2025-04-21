import { z } from 'zod';

export const GameScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','status','trackerId','gameData']);

export default GameScalarFieldEnumSchema;
