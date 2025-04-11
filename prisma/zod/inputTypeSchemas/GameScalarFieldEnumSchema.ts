import { z } from 'zod';

export const GameScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','status','data','trackerId']);

export default GameScalarFieldEnumSchema;
