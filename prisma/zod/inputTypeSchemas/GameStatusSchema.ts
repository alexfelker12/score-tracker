import { z } from 'zod';

export const GameStatusSchema = z.enum(['ACTIVE','COMPLETED','CANCELLED']);

export type GameStatusType = `${z.infer<typeof GameStatusSchema>}`

export default GameStatusSchema;
