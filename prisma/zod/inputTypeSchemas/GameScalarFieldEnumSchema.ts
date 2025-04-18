import { z } from 'zod';

export const GameScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','status','trackerId']);

export default GameScalarFieldEnumSchema;
