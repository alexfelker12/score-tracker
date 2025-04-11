import { z } from 'zod';

export const TrackerScalarFieldEnumSchema = z.enum(['id','type','displayName','archived','updatedAt','createdAt','creatorId']);

export default TrackerScalarFieldEnumSchema;
