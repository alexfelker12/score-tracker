import { z } from 'zod';

export const TrackerTypeSchema = z.enum(['SCHWIMMEN','DURAK']);

export type TrackerTypeType = `${z.infer<typeof TrackerTypeSchema>}`

export default TrackerTypeSchema;
